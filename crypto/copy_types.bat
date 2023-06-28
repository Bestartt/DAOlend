@echo off

REM Set the source and destination file paths
set SOURCE_FILE_1=typechain-types\CreditUnion.ts
set SOURCE_FILE_2=typechain-types\common.ts
set DESTINATION_FILE_1=..\frontend\src\typechain\types.ts
set DESTINATION_FILE_2=..\frontend\src\typechain\common.ts

REM Copy the files
copy "%SOURCE_FILE_1%" "%DESTINATION_FILE_1%"
copy "%SOURCE_FILE_2%" "%DESTINATION_FILE_2%"

echo Files copied successfully.
