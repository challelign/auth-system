//THIS IS AUTH METHOD IS SERVER MODE
/* 
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";


const SettingsPage = async () => {
	const session = await auth();
	return (
		<div>
			{JSON.stringify(session)}

			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<Button type="submit" className="bg-sky-500  ">
					Logout
				</Button>
			</form>
		</div>
	);
};

export default SettingsPage; */

// THIS IS CLIENT MODE AND U NEED TO SET SESSIONPROVIDER TO LAYOUT
"use client";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
	const user = useCurrentUser();

	const onClick = () => {
		signOut();
	};
	const onLogout = () => {
		logout();
	};
	return (
		<div className="bg-white p-10 rounded-xl">
			<Button type="submit" onClick={onClick} className="bg-sky-500  ">
				Logout
			</Button>

			<Button type="submit" onClick={onLogout} className="bg-sky-500  ">
				Logout Action
			</Button>
		</div>
	);
};

export default SettingsPage;
