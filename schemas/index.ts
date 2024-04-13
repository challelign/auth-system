import { UserRole } from "@prisma/client";
import * as z from "zod";
export const LoginSchema = z.object({
	email: z.string().email({
		message: "Email is required",
	}),
	password: z.string().min(1, {
		message: "Password is required",
	}),
	code: z.optional(z.string()), // optional
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

export const SettingsSchema = z
	.object({
		name: z.optional(z.string()),
		isTwoFactorEnabled: z.optional(z.boolean()),
		role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.EDITOR]),
		email: z.optional(z.string().email()),
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: "New password is required!",
			path: ["newPassword"],
		}
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}

			return true;
		},
		{
			message: "Password is required!",
			path: ["password"],
		}
	);
