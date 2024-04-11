"use server";
import axios from "axios";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
	getTwoFactorTokenByEmail,
	getTwoFactorTokenByToken,
} from "@/data/two-factor-data-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	console.log("values", values);

	const validatedFields = LoginSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}
	const { email, password, code } = validatedFields.data;

	// You can comment this to login with out verification
	// start  Verified email to login
	const existingUser = await getUserByEmail(email);
	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "Email does not exist" };
	}
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);

		await sendVerificationEmail(
			verificationToken.email!,
			verificationToken.token!
		);
		return { success: "Confirmation email sent!" };
	}

	// end  Verified email to login

	// 2FA confirmation
	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			// verify code
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: "Invalid code!" };
			}
			console.log("twoFactorToken?.token", twoFactorToken?.token);
			console.log("code", code);
			if (twoFactorToken?.token !== code) {
				return { error: "Invalid code " };
			}
			const hasExpired = new Date(twoFactorToken.expires) < new Date();
			if (hasExpired) {
				return { error: "Code expired" };
			}

			await db.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});
			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);
			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}
			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);

			await sendTwoFactorTokenEmail(
				twoFactorToken.email!,
				twoFactorToken.token!
			);
			return { twoFactor: true };
		}
	}
	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid Credentials" };
				default: {
					return { error: "Something went wrong" };
				}
			}
		}
		throw error;
	}
	// return { success: "Email sent" };
};
