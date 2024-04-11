import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

	const { data, error } = await resend.emails.send({
		from: "Auth-system <onboarding@resend.dev>",
		to: email,
		subject: "Confirm your email",
		// html: `<p> Click <a href="${confirmLink}">here</a>to confirm email</p>`,
		html: `<p>Dear User,</p>
           <p>Thank you for signing up with Auth-system. To complete your registration, please click the button below to confirm your email:</p>
           <p><a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Email</a></p>
           <p>If you did not create an account with us, please ignore this email.</p>
           <p>Thank you,</p>
           <p>The Auth-system Team</p>`,
	});
	if (error) {
		return { error: `res.status(400).json(error)` };
	}
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;

	const { data, error } = await resend.emails.send({
		from: "Auth-system <onboarding@resend.dev>",
		to: email,
		subject: "Reset your password",
		// html: `<p> Click <a href="${confirmLink}">here</a>to reset password</p>`,
		html: `<p>Dear User,</p>
           <p>We have received a request to reset your password. To proceed, please click the button below:</p>
           <p><a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
           <p>If you did not request a password reset, please ignore this email.</p>
           <p>Thank you,</p>
           <p>The Auth-system Team</p>`,
	});
	if (error) {
		return { error: `res.status(400).json(error)` };
	}
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	const { data, error } = await resend.emails.send({
		from: "Auth-system <onboarding@resend.dev>",
		to: email,
		subject: "2FA Code",
		// html: `<p> Click <a href="${confirmLink}">here</a>to reset password</p>`,
		html: `<p>Dear User,</p>
           <p>We have received a request to get Two Factor Authentication. To proceed, please copy the 2FA Code below:</p>
           <p style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">${token}</p>
           <p>If you did not request a password reset, please ignore this email.</p>
           <p>Thank you,</p>
           <p>The Auth-system Team</p>`,
	});
	if (error) {
		return { error: `res.status(400).json(error)` };
	}
};
