"use client";

import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
	const pathname = usePathname();
	return (
		<nav
			className="border-b-2 flex flex-wrap items-center sticky top-0
        justify-between
        w-full
        p-4
        sm:p-2
     shadow-sm
        text-lg text-gray-700 
		bg-secondary"
		>
			<div className="flex gap-x-2  ">
				<Button
					asChild
					variant={pathname === "/settings" ? "default" : "outline"}
				>
					<Link href="/settings">Settings</Link>
				</Button>
				<Button
					asChild
					variant={pathname === "/server" ? "default" : "outline"}
				>
					<Link href="/server">Server</Link>
				</Button>
				<Button
					asChild
					variant={pathname === "/client" ? "default" : "outline"}
				>
					<Link href="/client">Client</Link>
				</Button>
				<Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
					<Link href="/admin">Admin</Link>
				</Button>
			</div>

			<UserButton />
		</nav>
	);
};

export default Navbar;
