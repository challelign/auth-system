"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import FormSuccess from "../form-success";
import FormError from "../form-error";
const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const onSubmit = useCallback(() => {
		// console.log(token);
		if (success || error) {
			return;
		}
		if (!token) {
			setError("Missing token");
			return;
		}
		newVerification(token)
			.then((data) => {
				setSuccess(data?.success);
				setError(data?.error);
			})
			.catch(() => {
				setError("Something went wrong");
			});
	}, [token, success, error]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);
	return (
		<CardWrapper
			headerLabel="Confirming your email verification"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<div className="flex items-center justify-center w-full">
				{!success && !error && <BeatLoader />}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};

export default NewVerificationForm;
