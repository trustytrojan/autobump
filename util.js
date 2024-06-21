export const log = (...values) => {
	for (const v of values)
		console.log(`[${new Date().toLocaleString()}] ${v}`);
};

export const millis = Object.freeze({
	/** @param {number} hours */
	fromHours: hours => 3.6e6 * hours,

	/** @param {number} minutes */
	fromMinutes: minutes => 6e4 * minutes
});
