import { Client, TextChannel } from 'discord.js-selfbot-v13';
import assert from 'node:assert';
import process from 'node:process';
import { log } from './util.ts';

// import .env, setup constants and logging
(await import('dotenv')).config();
const {
	DISBOARD_CHANNEL_ID,
	DISCORDHOME_CHANNEL_ID,
	DISCODUS_CHANNEL_ID,
	CONTACT_USER_ID
} = process.env;

if (!DISBOARD_CHANNEL_ID && !DISCORDHOME_CHANNEL_ID && !DISCODUS_CHANNEL_ID) {
	throw Error('no bump channel ids provided in environment!');
}

// setup discord.js client
const client = new Client({ presence: { status: 'invisible' } });
await client.login();
log(`Logged in as: ${client.user?.tag}`);

// setup error/interrupt handling
process.on('uncaughtException', err => {
	console.error(err.stack ?? err);
	contact_user
		?.send('```' + (err.stack ? `js\n${err.stack}` : err) + '```')
		.then(() =>
			log(
				`Sent error details to user ${CONTACT_USER_ID} (${contact_user.tag})`
			)
		)
		.catch(() =>
			log(
				`Failed to contact user ${CONTACT_USER_ID} (${contact_user.tag})`
			)
		)
		.finally(() => {
			log('Disconnecting from Discord');
			client.destroy();
			log('Exiting');
			process.exit(1);
		});
});

const signalHandler = async (signal: NodeJS.Signals) => {
	log(`${signal} received`);
	if (await contact_user?.send(`\`${signal}\` received, exiting`))
		log(
			`Message sent to contact user ${CONTACT_USER_ID} (${contact_user?.tag})`
		);
	log('Disconnecting from Discord');
	client.destroy();
	log('Exiting');
	process.exit();
};

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);

// fetch contact user
const contact_user = CONTACT_USER_ID
	? await client.users.fetch(CONTACT_USER_ID)
	: null;

if (contact_user)
	log(`Fetched contact user ${contact_user.id} (${contact_user.username})`);

const fetchBumpChannel = async (id: string) => {
	const channel = await client.channels.fetch(id);
	if (!channel) throw `Channel ${id} not found or not accessible!`;
	if (!(channel instanceof TextChannel))
		throw `Channel ${id} is not a text channel!`;
	if (
		!channel
			.permissionsFor(channel.guild.members.me!, true)
			.has('USE_APPLICATION_COMMANDS')
	)
		throw `You don't have slash command permissions in channel ${id}!`;
	return channel;
};

const startBumpLoop = async (bumperModulePath: string, channelId: string) => {
	const channel = await fetchBumpChannel(channelId);
	const bump: (channel: TextChannel) => Promise<number> = (
		await import(bumperModulePath)
	).default;
	const loop = (bumpDelayMs: number) => {
		assert(bumpDelayMs > 0);
		log(
			`Next bump: ${new Date(Date.now() + bumpDelayMs).toLocaleTimeString()}`
		);
		setTimeout(() => bump(channel).then(loop), bumpDelayMs);
	};
	bump(channel).then(loop);
};

if (DISBOARD_CHANNEL_ID) {
	startBumpLoop(
		`${import.meta.dirname}/bumpers/disboard.ts`,
		DISBOARD_CHANNEL_ID
	);
}

if (DISCORDHOME_CHANNEL_ID) {
	startBumpLoop(
		`${import.meta.dirname}/bumpers/discordhome.ts`,
		DISCORDHOME_CHANNEL_ID
	);
}

if (DISCODUS_CHANNEL_ID) {
	startBumpLoop(
		`${import.meta.dirname}/bumpers/discodus.ts`,
		DISCODUS_CHANNEL_ID
	);
}
