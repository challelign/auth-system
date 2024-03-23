import { db } from "@/lib/db";

export const getPasswordResetTokenByEmail = async (email: string) => {
	const passwordResetToken = await db.verificationToken.findFirst({
		where: {
			email,
		},
	});
	return passwordResetToken;
};

export const getPasswordResetTokenByToken = async (token: string) => {
	const passwordResetToken = await db.passwordResetToken.findUnique({
		where: {
			token,
		},
	});
	return passwordResetToken;
};
