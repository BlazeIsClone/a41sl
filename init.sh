#!/bin/bash

DISCORD_USERNAME=${DISCORD_USERNAME:-"All For One Notifier"}
DISCORD_WEBHOOK_URL=$process.env.ANNOUNCEMENT_WEBHOOK

if [ -z "$DISCORD_WEBHOOK_URL" ]; then
     echo "You must define DISCORD_WEBHOOK_URL in order to post a message";
      exit 1;
      fi
     
     curl -X POST --data-urlencode 'payload_json={"username": "'"$DISCORD_USERNAME"'", "content":"'"Hello, Discord"'"}' $DISCORD_WEBHOOK_URL 
