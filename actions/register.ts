"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	console.log("values", values);
	const validatedFields = RegisterSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}
	const { email, password, name } = validatedFields.data;
	const hashPassword = await bcryptjs.hash(password, 10);
	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return { error: "Email already in use!" };
	}

	await db.user.create({
		data: {
			name,
			email,
			password: hashPassword,
		},
	});
	// start  Verified email to login
	//Start You can comment this to register user without email verification

	const verificationToken = await generateVerificationToken(email);
	// 	   SEND EMAIL VERIFICATION
	await sendVerificationEmail(
		verificationToken.email!,
		verificationToken.token!
	);
	//End You can comment this to register user without email verification

	return { success: "Confirmation email sent!" };

	// return { success: "User created" };
};
