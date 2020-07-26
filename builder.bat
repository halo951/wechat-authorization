:: clean ./dist
@ if exist .\dist (rd /s/q .\dist)

:: build
@ webpack %*
:: print end
echo 1