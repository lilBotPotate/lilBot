# lilBot
Discord Bot for lilPotate's server  
To set up the Bot you have to add `config.yaml` and `.env`. In the `src/config` you already have examples you just have to rename them and fill in the data.  
To run the bot: `npm start` or `npm pm2`  

### config.yaml:
```yaml
prefixes:
  normal: PREFIX FOR NORMAL COMMANDS
  admin: PREFIX FOR ADMIN COMMANDS
  master: PREFIX FOR MASTER COMMANDS

discord:
  default_role: DEFAULT DISCORD ROLE
  subscriber_role: DISCORD SUBSCRIBER ROLE
  twitch_updates_chat: CHAT TO SEND WHEN LILPOTATE IS LIVE
  twitch_discord_chat: CHAT TO SEND TWITCH CHAT
  bot_owner_id: DISCORD ID OF THE BOT OWNER
  admin_roles:
    - DISCORD ADMIN ROLE 
  owners:
    - DISCORD OWNER ID

twitch:
  username: BOTS TWITCH USERNAME
  channels: 
    - TWITCH CHANNEL NAME
  admins:
    - name: TWITCH USERNAME
      id: TWITCH USER ID
  icons:
    no_badge: 🤖
    sub_gifter: 🤖
    moderator: 🤖
    subscriber: 🤖
    partner: 🤖
    founder: 🤖
    premium: 🤖
    bits: 🤖

extra:
  default_steam_id: STEAM ID 64
```   

### .env:
```php
DISCORD_TOKEN="DISCORD BOT TOKEN"
TWITCH_TOKEN="TWITCH BOT TOKEN"
TWITCH_CLIENT_ID="TWITCH ACCOUNT DEV CLIENT ID"
STEAM_KEY="STEAM API KEY"
GOOGLE_SUGGESTION_SHEET_ID="ID OF THE GOOGLE SHEET FOR SUGGESTIONS"
GOOGLE_CREDENTIALS={ "GENERATED GOOGLE CREDENTIALS FOR SHEETS API" }
GOOGLE_TOKEN={ "GENERATED GOOGLE TOKEN FOR SHEETS API" }
```