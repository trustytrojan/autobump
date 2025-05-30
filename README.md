# autobump
A Discord selfbot that can bump several kinds of "bump" bots automatically! Currently supports [DISBOARD](https://disboard.org), [DiscordHome](https://discordhome.com), and [Discodus](https://discodus.com).

Credit to [Lozarth/Disboard-Auto-Bump-Selfbot](https://github.com/Lozarth/Disboard-Auto-Bump-Selfbot) for the original DISBOARD bumping code and for inspiration.

## Usage
Assuming you have Deno installed:
1. Run `deno install` to install dependencies.
2. Write a `.env` file like so:
	```sh
	# Discord user account token (can NOT be a Bot token)
	DISCORD_TOKEN=

	# User to DM in case of errors (optional)
	CONTACT_USER_ID=

	# Bump bot channel IDs (one must be present)
	DISBOARD_CHANNEL_ID=
	DISCORDHOME_CHANNEL_ID=
	DISCODUS_CHANNEL_ID=
	```
3. Run `deno task start` to start autobump in the background. Run `deno task stop` to stop it.
