"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { getUserByEmail } from "@/data/user";

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

	// 	TODO: SEND EMAIL VERIFICATION

	return { success: "User created" };
};
