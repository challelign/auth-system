"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { useEffect, useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const searchParams = useSearchParams();
	// const callbackUrl = searchParams.get("callbackUrl");

	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? "Email already in use with different provider"
			: "";
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmitLogin = (values: z.infer<typeof LoginSchema>) => {
		console.log(values);
		setError("");
		setSuccess("");
		startTransition(() => {
			login(values)
				.then((data) => {
					// setError(data?.error);
					// setSuccess(data?.success);
					if (data?.error) {
						form.reset();
						setError(data?.error);
					}
					if (data?.success) {
						form.reset();
						setSuccess(data.success);
					}
					if (data?.twoFactor) {
						// if ((data as { error?: string }).error) {
						// 	form.reset();
						// 	setError((data as { error?: string }).error);
						// }
						setShowTwoFactor(true);
					}
				})
				.catch(() => setError("Something went wrong"));
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
						{showTwoFactor && (
							<>
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Two-Factor Code</FormLabel>
											<FormControl>
												<InputOTP maxLength={6} {...field}>
													<InputOTPGroup className="space-x-3">
														<InputOTPSlot
															index={0}
															className="border border-cyan-500"
														/>
														<InputOTPSlot
															index={1}
															className="border border-cyan-500"
														/>
														<InputOTPSlot
															index={2}
															className="border border-cyan-500"
														/>
														<InputOTPSlot
															index={3}
															className="border border-cyan-500"
														/>
														<InputOTPSlot
															index={4}
															className="border border-cyan-500"
														/>
														<InputOTPSlot
															index={5}
															className="border border-cyan-500"
														/>
													</InputOTPGroup>
												</InputOTP>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{!showTwoFactor && (
							<>
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

											<Button
												size="sm"
												variant="link"
												asChild
												className="px-0 font-normal"
											>
												<Link href="/auth/reset">Forget password?</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} className="w-full">
						{showTwoFactor ? "Confirm Code" : "Login"}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default LoginForm;
