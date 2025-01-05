# autobump
A Discord selfbot that can bump several kinds of "bump" bots automatically!

The code is based on [Lozarth/Disboard-Auto-Bump-Selfbot](https://github.com/Lozarth/Disboard-Auto-Bump-Selfbot).

## Usage
Assuming you have Deno or NPM installed:
1. Run `deno install` or `npm i` to install dependencies.
2. Write a `.env` file with the following structure:
```
DISCORD_TOKEN=
DISBOARD_CHANNEL_ID=
DISCORDHOME_CHANNEL_ID=
CONTACT_USER_ID=
```
- `DISCORD_TOKEN`: Discord user account to use (cannot be a Bot token)
- `DISBOARD_CHANNEL_ID`: channel to send DISBOARD bump commands in
- `DISCORDHOME_CHANNEL_ID`: channel to send DiscordHome bump commands in
- `CONTACT_USER_ID`: user to DM in case of errors (optional)

4. Currently autobump supports two bump bots: DISBOARD and DiscordHome. To run the DISBOARD autobumper, you need to provide a channel ID in the `DISBOARD_CHANNEL_ID` environment variable. Same thing for DiscordHome. At least one must be provided to run autobump.
