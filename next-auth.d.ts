import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

/**
 * Add any custom field here from your database or static name
 */
export type ExtendedUser = DefaultSession["user"] & {
	// role: "ADMIN" | "USER" | "EDITOR";
	id: string;
	customField: string;
	role: UserRole;
	isTwoFactorEnabled: boolean;
};
declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}
