import {
  AssetHashType,
  BundlingOutput,
  DockerImage,
  Duration,
  aws_s3_assets,
} from "aws-cdk-lib";
import { Code, S3Code } from "aws-cdk-lib/aws-lambda";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { md5hash } from "aws-cdk-lib/core/lib/helpers-internal";
import { Construct } from "constructs";
import * as path from "path";
import * as fs from "fs";

function calculateHash(paths: string[]): string {
  // Use an iterative approach instead of recursion to avoid stack overflow
  let allPaths = [...paths];
  let finalHash = "";
  
  // Process directories in batches to avoid memory issues
  const MAX_BATCH_SIZE = 100;
  
  while (allPaths.length > 0) {
    // Take a batch of paths
    const batch = allPaths.splice(0, MAX_BATCH_SIZE);
    
    for (const p of batch) {
      try {
        if (!fs.existsSync(p)) {
          console.warn(`Path does not exist: ${p}`);
          continue;
        }
        
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
          const dirs = fs.readdirSync(p);
          // Add subdirectories and files to the paths list
          for (const d of dirs) {
            const fullPath = path.join(p, d);
            try {
              const itemStat = fs.statSync(fullPath);
              if (itemStat.isDirectory()) {
                allPaths.push(fullPath);
              } else if (itemStat.isFile()) {
                // Hash the file content
                const fileContent = fs.readFileSync(fullPath);
                finalHash = md5hash(finalHash + fileContent);
              }
            } catch (err) {
              console.warn(`Error processing path ${fullPath}: ${err}`);
            }
          }
        } else if (stat.isFile()) {
          // Hash the file content
          const fileContent = fs.readFileSync(p);
          finalHash = md5hash(finalHash + fileContent);
        }
      } catch (err) {
        console.warn(`Error processing path ${p}: ${err}`);
      }
    }
  }
  
  return finalHash;
}

export class SharedAssetBundler extends Construct {
  private readonly sharedAssets: string[];
  private readonly WORKING_PATH = "/asset-input/";
  /**
   * Instantiate a new SharedAssetBundler. You then invoke `bundleWithAsset(pathToAsset)` to
   * bundle your asset code with the common code.
   *
   * For Lambda function handler assets, you can use `bundleWithLambdaAsset(pathToAsset)` as
   * a drop-in replacement for `lambda.Code.fromAsset()`
   *
   * @param scope
   * @param id
   * @param commonFolders : array of common folders to bundle with your asset code
   */
  constructor(scope: Construct, id: string, sharedAssets: string[]) {
    super(scope, id);
    this.sharedAssets = sharedAssets;
  }

  bundleWithAsset(assetPath: string): Asset {
    try {
      console.log(`Bundling asset: ${assetPath}`);
      const assetHash = calculateHash([assetPath, ...this.sharedAssets]);
      console.log(`Asset hash calculated: ${assetHash.substring(0, 8)}...`);
      
      const asset = new aws_s3_assets.Asset(
        this,
        md5hash(assetPath).slice(0, 6),
        {
          path: assetPath,
          bundling: {
          image:
            process.env.NODE_ENV === "test"
              ? DockerImage.fromRegistry("dummy-skip-build-in-test")
              : DockerImage.fromBuild(path.posix.join(__dirname, "alpine-zip"), {
                  buildArgs: {
                    // Add build args if needed
                  }
                }),
          command: [
            "zip",
            "-r",
            "-9",
            path.posix.join("/asset-output", "asset.zip"),
            ".",
          ],
          volumes: this.sharedAssets.map((f) => ({
            containerPath: path.posix.join(this.WORKING_PATH, path.basename(f)),
            hostPath: f,
          })),
          workingDirectory: this.WORKING_PATH,
          outputType: BundlingOutput.ARCHIVED,
        },
        assetHash: calculateHash([assetPath, ...this.sharedAssets]),
        assetHashType: AssetHashType.CUSTOM,
      }
      );
      return asset;
    } catch (error) {
      console.error(`Error bundling asset ${assetPath}:`, error);
      throw error;
    }
  }

  bundleWithLambdaAsset(assetPath: string): S3Code {
    const asset = this.bundleWithAsset(assetPath);
    return Code.fromBucket(asset.bucket, asset.s3ObjectKey);
  }
}
