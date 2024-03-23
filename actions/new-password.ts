"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcryptjs from "bcryptjs";

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token: string | null
) => {
	try {
		if (!token) {
			return { error: "Missing token!" };
		}
		const validatedFields = NewPasswordSchema.safeParse(values);
		if (!validatedFields.success) {
			return { error: "Invalid fields" };
		}

		const { password } = validatedFields.data;

		const existingToken = await getPasswordResetTokenByToken(token);
		if (!existingToken) {
			return { error: "Invalid token" };
		}

		const hasExpired = new Date(existingToken.expires) < new Date();
		if (hasExpired) {
			return { error: "Token has expired" };
		}
		const existingUser = await getUserByEmail(existingToken.email!);
		if (!existingUser) {
			return { error: "Email dose not exist" };
		}

		const hashPassword = await bcryptjs.hash(password, 10);
		await db.user.update({
			where: {
				id: existingUser.id,
			},
			data: { password: hashPassword },
		});
		await db.passwordResetToken.delete({
			where: {
				id: existingToken.id,
			},
		});
		return { success: "Password updated" };
	} catch (error) {
		console.log("[ERROR NEW_VERIFICATION]", error);
		return null;
	}
};
