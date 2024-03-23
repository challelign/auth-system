"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "../ui/input";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmitChangePassword = (
		values: z.infer<typeof NewPasswordSchema>
	) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};
	return (
		<CardWrapper
			headerLabel=" Enter a new password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmitChangePassword)}
					className="space-y-6"
				>
					<div className="space-y-6">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="******"
											type="password"
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} className="w-full">
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default NewPasswordForm;
