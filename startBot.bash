logName=$(date '+%Y-%m-%d_%H:%M:%S.log')
echo "Started bot.js"
echo "Writing to $logName"
node bot.js > "./logs/$logName" 2>&1