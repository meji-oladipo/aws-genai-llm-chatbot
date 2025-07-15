import { BreadcrumbGroup } from "@cloudscape-design/components";
import useOnFollow from "../../../common/hooks/use-on-follow";
import BaseAppLayout from "../../../components/base-app-layout";
import { CHATBOT_NAME } from "../../../common/constants";
import { BedrockPromptList } from "../../../components/bedrock-prompts/bedrock-prompt-list";

export default function BedrockPrompts() {
  const onFollow = useOnFollow();

  return (
    <BaseAppLayout
      contentType="table"
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: CHATBOT_NAME,
              href: "/",
            },
            {
              text: "Prompts Library",
              href: "/admin/bedrock-prompts",
            },
          ]}
        />
      }
      content={<BedrockPromptList />}
    />
  );
}