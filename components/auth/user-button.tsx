"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	FaUser,
	FaUserAlt,
	FaUserAltSlash,
	FaUserCircle,
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

const UserButton = () => {
	const user = useCurrentUser();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image || ""} />
					<AvatarFallback className="bg-sky-500">
						<FaUser className="text-white" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40 " align="end">
				<DropdownMenuLabel className="flex items-center">
					<FaUserCircle className="h-4 w-4 mr-2" /> {user?.name || "My account"}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<LogoutButton>
					<DropdownMenuItem className="cursor-pointer">
						<ExitIcon className="h-4 w-4 mr-2" /> Logout
					</DropdownMenuItem>
				</LogoutButton>

				<DropdownMenuItem className="cursor-pointer">
					<FaUserAlt className="h-4 w-4 mr-2" />
					Profile
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
