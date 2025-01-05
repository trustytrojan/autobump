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

3. Run `deno task build` or `npx tsc`
4. Run `node dist`, or `deno task start` / `npm start` to run in the background. Unfortunately Deno hasn't implemented `setTimeout` in the way I expected, preventing both bumpers to run simultaneously. So NodeJS still needs to be used to run the compiled JavaScript.

**NOTE:** Currently autobump supports two bump bots: DISBOARD and DiscordHome. To run the DISBOARD autobumper, you need to provide a channel ID in the `DISBOARD_CHANNEL_ID` environment variable. Same thing for DiscordHome with the `DISCORDHOME_CHANNEL_ID` environment variable. At least one must be provided to run autobump.
