"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
	const onServerActionClick = () => {
		admin().then((data) => {
			if (data.error) {
				toast.error(data.error);
			}
			if (data.success) {
				toast.success(data.success);
			}
		});
	};
	const onApiRouteClick = () => {
		fetch("/api/admin").then((response) => {
			if (response.ok) {
				console.log("OKAY");
				toast.success("Allowed API Route Access");
			} else {
				console.log("FORBIDDEN");
				toast.error("Forbidden API Route");
			}
		});
	};
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center"></p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message="Your are allowed to access this content" />
				</RoleGate>

				<div className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-md">
					<p className="text-sm from-font-medium">Admin-0nly API Route</p>
					<Button onClick={onApiRouteClick}>Click to test</Button>
				</div>

				<div className="flex flex-row items-center justify-between rounded-lg p-3 border shadow-md">
					<p className="text-sm from-font-medium">Admin-0nly Server Action</p>
					<Button onClick={onServerActionClick}>Click to test</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;
