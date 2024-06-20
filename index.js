import { Client, TextChannel } from 'discord.js-selfbot-v13';

const DISBOARD_ID = '302050872383242240';

const { token, bump_channel } = (await import('./config.json', { with: { type: 'json' } })).default;
const client = new Client;

const log = (msg) => console.log(`[${new Date().toLocaleString()}] ${msg}`);
const error = (msg) => { console.error(msg); process.exit(1); };

await client.login(token);
log(`Logged in as: ${client.user.tag}`);

const channel = await client.channels.fetch(bump_channel);

if (!(channel instanceof TextChannel))
	error(`Channel ${bump_channel} is not a text channel!`);
if (!channel.permissionsFor(channel.guild.members.me, true).has('USE_APPLICATION_COMMANDS'))
	error("You don't have slash command permissions!");

const bump = () => channel.sendSlash(DISBOARD_ID, 'bump').then(() => log('Bumped!'));

/**
 * @param {number} hours 
 */
const hoursToMs = (hours) => 3.6e6 * hours;

const loop = () => {
	// send bump message every 2-3 hours, to prevent detection.
	const timeUntilNextBumpMs = hoursToMs(2 + Math.random());
	log(`Next bump: ${new Date(Date.now() + timeUntilNextBumpMs).toLocaleTimeString()}`);
	setTimeout(() => { bump(); loop(); }, timeUntilNextBumpMs);
};

bump();
loop();
