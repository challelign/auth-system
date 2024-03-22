"use client";
import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {
	const onClick = (provider: "google" | "github") => {
		signIn(provider, {
			callbackUrl: DEFAULT_LOGIN_REDIRECT,
		});
	};
	/* const handleClickGoogle = () => {
		signIn("google");
	};
	const handleClickGithub = () => {
		signIn("github");
	}; */
	return (
		<div className="flex items-center w-full gap-x-2">
			<Button
				onClick={() => onClick("google")}
				// onClick={handleClickGoogle}
				size="lg"
				className="w-full"
				variant="outline"
			>
				<FcGoogle className="h-5 w-5" />
			</Button>

			<Button
				onClick={() => onClick("github")}
				// onClick={handleClickGithub}
				size="lg"
				className="w-full"
				variant="outline"
			>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	);
};

export default Social;
