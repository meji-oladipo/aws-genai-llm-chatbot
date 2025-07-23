@echo off
echo Fixing Router issue in API handler...

REM Create a backup of the original files
echo Creating backups...
copy "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\lib\chatbot-api\functions\api-handler\routes\models.py" "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\lib\chatbot-api\functions\api-handler\routes\models.py.bak"
copy "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\lib\chatbot-api\functions\api-handler\index.py" "C:\Users\MejiOladipo\OneDrive - Nordic\Desktop\chatbox\aws-genai-llm-chatbot\lib\chatbot-api\functions\api-handler\index.py.bak"

echo Files backed up successfully.
echo Modified files with error handling.
echo Now run: npm run cdk deploy -- --hotswap