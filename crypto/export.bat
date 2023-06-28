@echo off

REM Check the exit code of the previous command

REM Copy the content of CreditUnion.json to contract.js
set SOURCE_FILE=artifacts\contracts\CreditUnion.sol\CreditUnion.json
set DESTINATION_FILE=..\frontend\src\contract.js

REM Prepend "export default" to the copied content
echo export default > %DESTINATION_FILE%
type %SOURCE_FILE% >> %DESTINATION_FILE%

echo Contract copied successfully.
