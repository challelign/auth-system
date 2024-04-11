import UserInfo from "@/components/auth/user-info";
import { currentUser } from "@/hooks/auth-user";

// 'use server'
const ServerPage = async () => {
	const user = await currentUser();
	return <UserInfo user={user} label="Server Component " />;
};

export default ServerPage;
