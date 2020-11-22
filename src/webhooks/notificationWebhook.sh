#!/bin/bash

DISCORD_USERNAME=${DISCORD_USERNAME:-"All For One Notifier"}
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/776042303902973983/8N3sMKNc_3FD6xdpqXq0jT70O29QR3DeU_NA85V3DpvKEloK44pTs4MgBavHcM1ijhff
if [ -z "$DISCORD_WEBHOOK_URL" ]; then
     echo "You must define DISCORD_WEBHOOK_URL in order to post a message";
      exit 1;
      fi
         curl -X POST --data-urlencode 'payload_json={"username": "'"$DISCORD_USERNAME"'", "content":"'"New Changes! - /google command changed to /image, new command /nasa added type the command to get help"'"}' $DISCORD_WEBHOOK_URL  
