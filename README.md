# autobump
A Discord selfbot that can bump several kinds of "bump" bots automatically!

The original code is based on [Lozarth/Disboard-Auto-Bump-Selfbot](https://github.com/Lozarth/Disboard-Auto-Bump-Selfbot).

## Usage
Assuming you are on Linux with `npm` installed:
1. Clone the repo: `git clone https://github.com/trustytrojan/autobump`

2. Run `npm i` to install dependencies.

3. Write a `.env` file with the following structure:
```
TOKEN=
CHANNEL_ID=
CONTACT_USER_ID=
```
- `TOKEN`: Discord user account to use (cannot be a Bot token)
- `CHANNEL_ID`: channel to send bump commands in
- `CONTACT_USER_ID`: user to DM in case of errors (optional)

4. Currently autobump supports two bump bots: DISBOARD and DiscordHome. To run a DISBOARD autobumper, run `BUMPER=./disboard.js npm start`. Otherwise run `BUMPER=./discordhome.js npm start`.
This will start the bot in the background using the specified bumper module. Output will be written to a `log` file, and the `node` process ID in `pid`. To avoid this behavior and run it in the foreground, instead run `node . disboard.js` for a DISBOARD autobumper.
