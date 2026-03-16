@echo off
set /p branch_name="Enter new branch name: "
set /p commit_msg="Enter commit message: "

:: 1. Create and switch to new branch
git checkout -b %branch_name%

:: 2. Add a dummy change (or you can manually edit files before running this)
echo // Auto-generated vulnerability test > security_test.js
echo const secret = "KEY_%RANDOM%"; >> security_test.js

:: 3. Git flow
git add .
git commit -m "%commit_msg%"

:: 4. Push to GitHub
git push origin %branch_name%

:: 5. Create the Pull Request via GitHub CLI
:: --fill automatically uses your commit message for the PR title/body
gh pr create --title "%commit_msg%" --body "Automated test PR from subrunner script" --base main --head %branch_name%

echo.
echo PR Created successfully! Check your subrunner terminal.
pause