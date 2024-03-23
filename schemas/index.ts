import * as z from "zod";
export const LoginSchema = z.object({
	email: z.string().email({
		message: "Email is required",
	}),
	password: z.string().min(1, {
		message: "Password is required",
	}),
});

export const RegisterSchema = z.object({
	name: z.string().min(2, {
		message: " Name is required",
	}),
	email: z.string().email({
		message: "Email is required",
	}),
	password: z.string().min(5, {
		message: "Minimum 5 characters required",
	}),
});

export const ResetSchema = z.object({
	email: z.string().email({
		message: "Email is required",
	}),
});

export const NewPasswordSchema = z.object({
	password: z.string().min(5, {
		message: "Minimum 5 characters required",
	}),
});
