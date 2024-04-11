import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findUnique({
			where: { token },
		});
		return twoFactorToken;
	} catch (error) {
		console.log("[getTwoFactorTokenByToken]", error);
		return null;
	}
};

export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const twoFactorTok = await db.twoFactorToken.findFirst({
			where: { email },
		});
		return twoFactorTok;
	} catch (error) {
		console.log("[getTwoFactorTokenByToken]", error);
		return null;
	}
};
