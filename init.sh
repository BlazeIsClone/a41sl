#!/bin/bash

DISCORD_USERNAME=${DISCORD_USERNAME:-"All For One Notifier"}
DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/757175037085220975/BFgdAwXrBzvhWbQXrRy4DS6iA7bKk_keq4JzB9GVDJR44MA60SF7QdPtH62sdjR7jxl_
if [ -z "$DISCORD_WEBHOOK_URL" ]; then
     echo "You must define DISCORD_WEBHOOK_URL in order to post a message";
      exit 1;
      fi
      #   curl -X POST --data-urlencode 'payload_json={"username": "'"$DISCORD_USERNAME"'", "content":"'"New commands available! Use /help"'"}' $DISCORD_WEBHOOK_URL  
