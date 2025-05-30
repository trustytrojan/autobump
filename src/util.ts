export const log = (msg: unknown) => {
	const obj = {} as { stack: string };
	Error.captureStackTrace(obj, log); // Capture the stack trace, excluding `log` itself
	const stackLines = obj.stack.split('\n');
	// The first line is the error message itself, which we don't need, and the second line should now be the caller
	const callerLine = stackLines[1] || ''; // Adjust based on your environment
	const functionNameMatch = callerLine.trim().match(/^at\s(\S+)/);
	const functionName = functionNameMatch ? functionNameMatch[1] : '';
	console.log(`[${new Date().toLocaleString()}; ${functionName}] ${msg}`);
};

export const millisFrom = ({
	hours,
	minutes,
	seconds,
}: {
	hours?: number;
	minutes?: number;
	seconds?: number;
}) =>
	(hours ? 3.6e6 * hours : 0)
	+ (minutes ? 6e4 * minutes : 0)
	+ (seconds ? 1e3 * seconds : 0);

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
