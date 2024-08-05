import { Client, TextChannel } from 'discord.js-selfbot-v13';
import assert from 'assert';
import { log } from './util.js';
import { argv, exit, stderr } from 'process';

if (argv.length < 3) {
	stderr.write(`usage: ${argv[1]} <path to bumper module>\n`);
	exit(1);
}

/** @type {(channel: TextChannel) => Promise<number>} */
const bump = (await import(argv[2])).default;

// import .env, setup constants and logging
(await import('dotenv')).config();
const { TOKEN, CHANNEL_ID, CONTACT_USER_ID } = process.env;

// setup discord.js client
const client = new Client({ presence: { status: 'invisible' } });
await client.login(TOKEN);
log(`Logged in as: ${client.user.tag}`);

// setup error/interrupt handling
process.on('uncaughtException', err => {
	console.error(err.stack ?? err);
	contact_user?.send('```' + (err.stack ? `js\n${err.stack}` : err) + '```')
		.then(() => log(`Sent error details to user ${CONTACT_USER_ID} (${contact_user.tag})`))
		.catch(() => log(`Failed to contact user ${CONTACT_USER_ID} (${contact_user.tag})`))
		.finally(() => {
			log('Disconnecting from Discord');
			client.destroy();
			log('Exiting');
			exit(1);
		});
});

const signalHandler = async (signal) => {
	log(`${signal} received`);
	if (await contact_user?.send(`\`${signal}\` received, exiting`))
		log(`Message sent to contact user ${CONTACT_USER_ID} (${contact_user.tag})`);
	log('Disconnecting from Discord');
	client.destroy();
	log('Exiting');
	exit();
};

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);

// fetch contact user
const contact_user = CONTACT_USER_ID ? await client.users.fetch(CONTACT_USER_ID) : null;

if (contact_user)
	log(`Fetched contact user ${contact_user.id} (${contact_user.username})`);

// fetch bump channel
const channel = await client.channels.fetch(CHANNEL_ID);

if (!channel)
	throw `Channel ${CHANNEL_ID} not found or not accessible!`;
if (!(channel instanceof TextChannel))
	throw `Channel ${CHANNEL_ID} (${channel.name}) is not a text channel!`;
if (!channel.permissionsFor(channel.guild.members.me, true).has('USE_APPLICATION_COMMANDS'))
	throw `You don't have slash command permissions in channel ${CHANNEL_ID} (${channel.name})!`;

/**
 * @param {number} bumpDelayMs The time in milliseconds to schedule the next bump
 */
const loop = (bumpDelayMs) => {
	assert(bumpDelayMs > 0);
	log(`Next bump: ${new Date(Date.now() + bumpDelayMs).toLocaleTimeString()}`);
	setTimeout(() => bump(channel).then(loop), bumpDelayMs);
};

bump(channel).then(loop);
