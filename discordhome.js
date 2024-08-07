import assert from 'assert';
import { Modal } from 'discord.js-selfbot-v13';
import { log, millis } from './util.js';

/**
 * Sends `/bump` to DH Bump in `channel`, and responds to the challenge.
 * @param {import('discord.js-selfbot-v13').TextChannel} channel
 * @returns {Promise<number>} The time in milliseconds until we can `/bump` again.
 */
export default async function discordhome(channel) {
	let msg;

	try { msg = await channel.sendSlash('826100334534328340', 'bump'); }
	catch {
		log(`/bump interaction failed, trying again in 1 minute`);
		return await new Promise(resolve => setTimeout(
			() => discordhome(channel).then(resolve),
			millis.fromMinutes(1)
		));
	}

	assert(!(msg instanceof Modal));

	if (msg.embeds[0]) {
		const { description, title } = msg.embeds[0];

		if (description?.startsWith('Unfortunately, ')) {
			const match = description.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?/);
			if (match) {
				log(`Need to wait ${match[1]}h ${match[2]}m until bumping again!`);
				return millis.fromHours(parseInt(match[1])) + millis.fromMinutes(parseInt(match[2]) + 1);
			} else
				throw new Error('DH Bump cooldown message has changed!');
		}
	
		if (title === 'Bump Error!') {
			throw new Error(embed.description);
		}
	
		// Sometimes it doesn't give a math challenge.
		if (description?.startsWith('Your server has been bumped successfully!')) {
			log('Bumped!');
			return millis.fromHours(2) + millis.fromMinutes(1);
		}
	}

	if (msg.content.startsWith('Please answer the question below:')) {
		/** @type {string} */
		const mathExpression = msg.content.split('\n')[1].replaceAll('x', '*');

		if (!/^[0-9+\-*/()\s]+$/.test(mathExpression)) {
			throw new Error('Invalid math expression!');
		}

		const result = eval(mathExpression);
		assert(typeof result === 'number');
		const buttonCustomId = msg.components[0].components.find(b => b.type === 'BUTTON' && b.label == result).customId;
		assert(buttonCustomId);

		// clickButton expects either an (x, y) coordinate or a component's customId
		await msg.clickButton(buttonCustomId).catch(() => {}); // this interaction WILL fail; discard the error

		// No matter what button is clicked, the bot does not respond to the interaction (considered a "failed interaction").
		// So we need to verify that the bump was successful by calling /bump again.
		// Easiest way to do this is recursing, since we have the 'Unfortunately, ' case handled above.
		return discordhome(channel);
	}

	throw new Error('None of the possible cases were hit!');
};
