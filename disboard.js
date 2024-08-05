import assert from 'assert';
import { Modal } from 'discord.js-selfbot-v13';
import { log, millis } from './util.js';

/**
 * Sends `/bump` to DISBOARD in `channel`.
 * @param {import('discord.js-selfbot-v13').TextChannel} channel
 * @returns {Promise<number>} The time in milliseconds until we can `/bump` again.
 */
export default async function disboard(channel) {
	let msg;

	try { msg = await channel.sendSlash('302050872383242240', 'bump'); }
	catch {
		log(`Initial interaction failed, trying again in 1 minute`);
		return await new Promise(resolve => setTimeout(
			() => disboard(channel).then(resolve),
			millis.fromMinutes(1)
		));
	}

	assert(!(msg instanceof Modal));

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
		} else
			throw new Error('DISBOARD cooldown message changed!');
	}

	log('Bumped!');
	return millis.fromHours(2) + millis.fromMinutes(1);
};
