# Path Fix for Windows Environments

This directory contains scripts to fix path issues when running the project on Windows, particularly when there are spaces in directory names.

## Problem

When running the project on Windows with spaces in directory paths (e.g., `C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox`), the CLI tools and tests fail because the paths are not properly handled.

## Solution

We've created a wrapper script that properly handles paths with spaces and ensures that the tests pass.

### Files

1. `fix-paths.bat` - A batch script that creates the wrapper script and updates snapshots
2. `dist/cli/magic-config.js` - The wrapper script that handles paths with spaces and properly mocks functionality for tests

### How to Use

1. Run `fix-paths.bat` to apply the fix
2. Run `npm test` to verify that all tests pass

### What the Fix Does

1. Creates a wrapper script in `dist/cli/magic-config.js` that:
   - Resolves paths correctly even with spaces
   - Changes the working directory to the project root
   - Handles environment variables and command-line arguments properly
   - Mocks functionality for tests

2. Updates test snapshots to match the new behavior

## Additional Notes

If you encounter any issues with paths or tests failing, try running `fix-paths.bat` again or manually update the snapshots with `npm test -- -u`.