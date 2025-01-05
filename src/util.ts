export const log = (msg: string) => {
	const obj: { stack: string } = {} as any;
	Error.captureStackTrace(obj, log); // Capture the stack trace, excluding `log` itself
	const stackLines = obj.stack.split('\n');
	// The first line is the error message itself, which we don't need, and the second line should now be the caller
	const callerLine = stackLines[1] || ''; // Adjust based on your environment
	const functionNameMatch = callerLine.trim().match(/^at\s(\S+)/);
	const functionName = functionNameMatch ? functionNameMatch[1] : '';
	console.log(`[${new Date().toLocaleString()}; ${functionName}] ${msg}`);
};

export const millis = Object.freeze({
	fromHours: (hours: number) => 3.6e6 * hours,
	fromMinutes: (minutes: number) => 6e4 * minutes
});
