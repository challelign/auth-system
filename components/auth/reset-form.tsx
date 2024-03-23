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
import { ResetSchema } from "@/schemas";
import { Input } from "../ui/input";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { reset } from "@/actions/reset";

const ResetForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmitReset = (values: z.infer<typeof ResetSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			reset(values).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};
	return (
		<CardWrapper
			headerLabel=" Forgot your password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmitReset)} className="space-y-6">
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
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} className="w-full">
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default ResetForm;
