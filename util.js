export const log = (msg) => {
	/** @type {{ stack: string }} */
	const obj = {};
	Error.captureStackTrace(obj, log); // Capture the stack trace, excluding `log` itself
	const stackLines = obj.stack.split('\n');
	// The first line is the error message itself, which we don't need, and the second line should now be the caller
	const callerLine = stackLines[1] || ''; // Adjust based on your environment
	const functionNameMatch = callerLine.trim().match(/^at\s(\S+)/);
	const functionName = functionNameMatch ? functionNameMatch[1] : '';
	console.log(`[${new Date().toLocaleString()}; ${functionName}] ${msg}`);
};

export const millis = Object.freeze({
	/** @param {number} hours */
	fromHours: hours => 3.6e6 * hours,

	/** @param {number} minutes */
	fromMinutes: minutes => 6e4 * minutes
});
