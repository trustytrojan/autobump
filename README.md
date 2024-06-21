# autobump
a discord selfbot that will send a `/bump` command to disboard every 2-3 hours with logging.

based on [Lozarth/Disboard-Auto-Bump-Selfbot](https://github.com/Lozarth/Disboard-Auto-Bump-Selfbot)

## usage
assuming you are on linux with `npm` installed:
1. clone the repo: `git clone https://github.com/trustytrojan/autobump`

2. run `npm i` to install dependencies.

3. write a `.env` file with the following structure:
```json
TOKEN=token
BUMP_CHANNEL_ID=bump_channel_id
CONTACT_USER_ID=contact_user_id
```

4. run `npm start`. this will start the bot in the background. output will be written to a `log` file, and the node process id in `pid`. to avoid this behavior and run it in the foreground, run `node .`
