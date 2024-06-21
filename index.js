import { Client, Message, TextChannel } from 'discord.js-selfbot-v13';
import assert from 'assert';

// import .env, setup constants and logging
(await import('dotenv')).config();
const { TOKEN, BUMP_CHANNEL_ID, CONTACT_USER_ID } = process.env;
const DISBOARD_ID = '302050872383242240';
const log = (...values) => { for (const v of values) console.log(`[${new Date().toLocaleString()}] ${v}`); };

// setup d.js client
const client = new Client;
await client.login(TOKEN);
log(`Logged in as: ${client.user.tag}`);
client.user.setPresence({ status: 'invisible' });

// setup error/interrupt handling
process.on('uncaughtException', async err => {
	console.error(err);
	if (await contact_user?.send(`\`\`\`js\n${err.stack ?? err}\`\`\``))
		log(`Message sent to contact user ${CONTACT_USER_ID} (${contact_user.tag})`);
	log('Exiting');
	process.exit(1);
});

process.on('SIGINT', async () => {
	log('SIGINT received');
	if (await contact_user?.send(`\`SIGINT\` received, exiting`))
		log(`Message sent to contact user ${CONTACT_USER_ID} (${contact_user.tag})`);
	log('Exiting');
	process.exit(1);
});

// fetch contact user
/** @type {import('discord.js-selfbot-v13').User | undefined} */
let contact_user;

if (CONTACT_USER_ID)
	contact_user = await client.users.fetch(CONTACT_USER_ID);

// fetch bump channel
const channel = await client.channels.fetch(BUMP_CHANNEL_ID);

if (!channel)
	throw `Channel ${BUMP_CHANNEL_ID} not found or not accessible!`;
if (!(channel instanceof TextChannel))
	throw `Channel ${BUMP_CHANNEL_ID} is not a text channel!`;
assert(channel instanceof TextChannel); // for vscode
if (!channel.permissionsFor(channel.guild.members.me, true).has('USE_APPLICATION_COMMANDS'))
	throw "You don't have slash command permissions!";

/**
 * sends `/bump` to disboard.
 * returns `undefined` or the time in ms until we can `/bump` again.
 */
const bump = async () => {
	const msg = await channel.sendSlash(DISBOARD_ID, 'bump');
	assert(msg instanceof Message);

	if (msg.embeds[0]?.description?.startsWith('Please wait')) {
		const match = msg.embeds[0].description.match(/\b\d+\b/);
		if (match) {
			const minutes = parseInt(match[0]) + 1; // add 1 minute to be safe
			log(`Need to wait ${match[0]} minutes until bumping again!`);
			return minutes * 6e4; // convert to ms
		}
	}

	log('Bumped!');
};

/**
 * @param {number} hours 
 */
const hoursToMs = (hours) => 3.6e6 * hours;

/**
 * @param {number} bumpDelayMs 
 */
const loop = (bumpDelayMs) => {
	if (bumpDelayMs <= 0)
		bumpDelayMs = hoursToMs(2 + 0.5 * Math.random());
	log(`Next bump: ${new Date(Date.now() + bumpDelayMs).toLocaleTimeString()}`);
	setTimeout(() => bump().then(loop), bumpDelayMs);
};

bump().then(loop);
