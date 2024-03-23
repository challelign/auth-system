/**
 *An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
	"/",
	"/auth/new-verification",
	// "/settings"
];

/**
 * An array of routes that are used for authentication
 * these routes will redirect logged in users to /settings
 *@type {string[]}
 */
export const authRoutes = [
	"/auth/login",
	"/auth/register",
	"/auth/error",
	"/auth/reset",
	"/auth/new-password",
];

/**
 *The prefix for API authentication
 * Routes that start with this prefix are user for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
