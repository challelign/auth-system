"use server";
import axios from "axios";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	console.log("values", values);
	/* 	const res = await axios.post(
		"http://10.1.85.11/AbayERP/Webservices/wslogin",
		{
			username: "chalie",
			password: "02560 ",
		}
	);
	if (res.data.message === "SUCCESS") {
		console.log(res.data.userid);
		console.log(res.data.username);
		console.log(res.data.branch_code);
		console.log(res.data.branch);
		console.log(res.data.position);
	} */

	const validatedFields = LoginSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}
	const { email, password } = validatedFields.data;
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
