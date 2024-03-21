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
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { login } from "@/actions/login";

const LoginForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmitLogin = (values: z.infer<typeof LoginSchema>) => {
		setError("");
		setSuccess("");
		startTransition(() => {
			login(values).then((data) => {
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};
	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonLabel="Don`t have an account ?"
			backButtonHref="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmitLogin)} className="space-y-6">
					<div className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="e.g cha@gmail.com"
											type="email"
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

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
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default LoginForm;
