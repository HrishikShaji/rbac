import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "../../../../auth";
import { SignInButton } from "@/components/AuthComponents";

export default async function SignInPage() {
	const session = await auth();

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center">Smart Home Access</CardTitle>
				</CardHeader>
				<CardContent>
					<SignInButton />
				</CardContent>
			</Card>
		</div>
	);
}
