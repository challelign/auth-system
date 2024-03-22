import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

	const { data, error } = await resend.emails.send({
		from: "Auth-system <onboarding@resend.dev>",
		to: email,
		subject: "Confirm your email",
		html: `<p> Click <a href="${confirmLink}">here</a>to confirm email</p>`,
	});
	if (error) {
		return { error: `res.status(400).json(error)` };
	}
};
