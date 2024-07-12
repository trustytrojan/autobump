import { Client, Message, TextChannel } from 'discord.js-selfbot-v13';
import assert from 'assert';
import { log, millis } from './util.js';

// import .env; setup constants and logging
(await import('dotenv')).config();
const { TOKEN, BUMP_CHANNEL_ID, CONTACT_USER_ID } = process.env;
const DISBOARD_ID = '302050872383242240';

// setup d.js client
const client = new Client({ presence: { status: 'invisible' } });
await client.login(TOKEN);
log(`Logged in as: ${client.user.tag}`);

// setup error/interrupt handling
process.on('uncaughtException', async err => {
	console.error(err);
	contact_user?.send(`\`\`\`js\n${err.stack ?? err}\`\`\``) // DO NOT await this
		.then(() => log(`Message sent to contact user ${CONTACT_USER_ID} (${contact_user.tag})`));
	log('Exiting');
	client.destroy();
	process.exit(1);
});

const signalHandler = async (signal) => {
	log(`${signal} received`);
	if (await contact_user?.send(`\`${signal}\` received, exiting`))
		log(`Message sent to contact user ${CONTACT_USER_ID} (${contact_user.tag})`);
	log('Exiting');
	client.destroy();
	process.exit();
};

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);

// fetch contact user
const contact_user = CONTACT_USER_ID ? await client.users.fetch(CONTACT_USER_ID) : null;

if (contact_user)
	log(`Fetched contact user ${contact_user.id} (${contact_user.username})`);

// fetch bump channel
const channel = await client.channels.fetch(BUMP_CHANNEL_ID);

if (!channel)
	throw `Channel ${BUMP_CHANNEL_ID} not found or not accessible!`;
if (!(channel instanceof TextChannel))
	throw `Channel ${BUMP_CHANNEL_ID} (${channel.name}) is not a text channel!`;
assert(channel instanceof TextChannel); // for vscode
if (!channel.permissionsFor(channel.guild.members.me, true).has('USE_APPLICATION_COMMANDS'))
	throw `You don't have slash command permissions in channel ${BUMP_CHANNEL_ID} (${channel.name})!`;

/**
 * Sends `/bump` to disboard.
 * @returns The time in milliseconds until we can `/bump` again.
 */
const bump = async () => {
	const msg = await channel.sendSlash(DISBOARD_ID, 'bump');

	// if this isn't a message, then disboard changed the bumping process!
	assert(msg instanceof Message);

	if (msg.content.startsWith('The DISBOARD API')) {
		log(`DISBOARD API is down... waiting a minute to try again`);
		return millis.fromMinutes(1);
	}

	if (msg.embeds[0]?.description?.startsWith('Please wait')) {
		const match = msg.embeds[0].description.match(/\b\d+\b/);
		if (match) {
			log(`Need to wait ${match[0]} minutes until bumping again!`);
			// add 1 minute to be safe
			return millis.fromMinutes(parseInt(match[0]) + 1);
		}
	}

	log('Bumped!');
	return millis.fromHours(2) + millis.fromMinutes(1);
};

/**
 * @param {number} bumpDelayMs The time in milliseconds to schedule the next bump
 */
const loop = (bumpDelayMs) => {
	assert(bumpDelayMs > 0);
	log(`Next bump: ${new Date(Date.now() + bumpDelayMs).toLocaleTimeString()}`);
	setTimeout(() => bump().then(loop), bumpDelayMs);
};

bump().then(loop);
