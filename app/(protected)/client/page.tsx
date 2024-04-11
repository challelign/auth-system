"use client";
import UserInfo from "@/components/auth/user-info";
import { currentUser } from "@/hooks/auth-user";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
	const user = useCurrentUser();
	return <UserInfo user={user} label="Client Component " />;
};

export default ClientPage;
