import assert from 'node:assert';
import Discord from 'discord.js-selfbot-v13';
import { log, millis, wait } from '../util.ts';

/**
 * Sends `/bump` to DH Bump in `channel`, and responds to the challenge.
 * @returns The time in milliseconds until we can `/bump` again.
 */
export default async function discordhome(channel: Discord.TextChannel): Promise<number> {
	let msg;

	try {
		msg = await channel.sendSlash('826100334534328340', 'bump');
	} catch {
		log(`/bump interaction failed, trying again in 1 minute`);
		return await new Promise(resolve =>
			setTimeout(() => discordhome(channel).then(resolve), millis.fromMinutes(1))
		);
	}

	assert(msg instanceof Discord.Message);
	const embed = msg.embeds[0];

	if (embed) {
		const { description, title } = embed;

		if (description?.startsWith('Unfortunately, ')) {
			const match = description.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?/);
			if (match) {
				log(`Need to wait ${match[1]}h ${match[2]}m until bumping again!`);
				return millis.fromHours(parseInt(match[1])) + millis.fromMinutes(parseInt(match[2]) + 1);
			} else throw new Error('DH Bump cooldown message has changed!');
		}

		if (title === 'Bump Error!') {
			throw new Error(embed.description!);
		}

		// Sometimes it doesn't give a math challenge.
		if (description?.startsWith('Your server has been bumped successfully!')) {
			log('Bumped!');
			return millis.fromHours(2) + millis.fromMinutes(1);
		}
	}

	if (msg.content.includes('Please answer the question below')) {
		const mathExpression = msg.content.split('\n')[2].replaceAll('*', '').replaceAll('x', '*');

		if (!/^[0-9+\-*/()\s]+$/.test(mathExpression)) {
			throw new Error('Invalid math expression!');
		}

		const result = eval(mathExpression);
		assert(typeof result === 'number');
		const buttonCustomId = msg.components[0].components.find(
			b => b.type === 'BUTTON' && b.label == result.toString()
		)?.customId;
		assert(buttonCustomId);

		// sometimes the button click fails... gonna have to keep trying
		while (true)
			try {
				await msg.clickButton(buttonCustomId);
				break;
			} catch (err) {
				if (err instanceof Error && !err.message.includes('INTERACTION_FAILED')) {
					log('Unknown error occurred when trying to click button!');
					throw err;
				}
				await wait(1_000);
			}

		// 2/27/25 - THEY FIXED THEIR BOT: interaction doesnt fail but updates the message.
		// Now we need to check it for a success message
		if (msg.embeds[0].description?.includes('bumped successfully')) {
			log('Bumped after math quiz!');
			return millis.fromHours(2) + millis.fromMinutes(1);
		}

		throw new Error('we screwed up');
	}

	throw new Error('None of the possible cases were hit!');
}
