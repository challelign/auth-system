"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";

export const newVerification = async (token: string) => {
	try {
		const existingToken = await getVerificationTokenByToken(token);
		if (!existingToken) {
			return { error: "Token dose not exist" };
		}
		const hasExpired = new Date(existingToken.expires) < new Date();
		if (hasExpired) {
			return { error: "Token has expired" };
		}

		const existingUser = await getUserByEmail(existingToken.email!);
		if (!existingUser) {
			return { error: "Email does not exist!" };
		}
		await db.user.update({
			where: {
				id: existingUser.id,
			},
			data: {
				emailVerified: new Date(),
				email: existingToken.email,
			},
		});
		// deleting the token
		await db.verificationToken.delete({
			where: {
				id: existingToken.id,
			},
		});

		return { success: "Email verified" };
	} catch (error) {
		console.log("[ERROR NEW_VERIFICATION]", error);
		return null;
	}
};
