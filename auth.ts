import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	// this manage if the user try to login with the same email for different provider at this time it show error page
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	// this helps to set emailVerified if the user use provider to login
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		//Start Email verification You can comment this to skip verification
		async signIn({ user, account }) {
			// Allow OAuth without email verification
			if (account?.provider !== "credentials") {
				return true;
			}
			// Prevent sing in without email verification
			const existingUser = await getUserById(user.id!);
			if (!existingUser?.emailVerified) {
				return false;
			}
			// 2FA
			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id
				);
				// console.log("[twoFactorConfirmation]", { twoFactorConfirmation });
				if (!twoFactorConfirmation) {
					return false;
				}
				// Delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}
			return true;
		},
		//End Email verification You can comment this to skip verification

		async session({ token, session }) {
			// console.log({ sessionToke: token });
			// console.log({ token });

			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			/**
			 * Access any field from your database
			 */
			// session.user.customField = "Test field";
			if (token.role && session.user) {
				// session.user.role = token.role as "ADMIN" | "USER" | "EDITOR";
				session.user.role = token.role as UserRole;
			}

			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email!;
			}
			return session;
		},
		async jwt({ token }) {
			if (!token.sub) {
				return null;
			}
			// console.log({ token });

			const existingUser = await getUserById(token.sub); //sub is the id from the token
			if (!existingUser) {
				return null;
			}

			// to update name , email and role every time to sync
			token.name = existingUser.name;
			token.email = existingUser.email;
			/**
			 * Add any field to the token from your db
			 */
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
});
