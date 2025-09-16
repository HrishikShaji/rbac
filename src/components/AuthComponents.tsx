"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function SignInButton() {
	return (
		<Button onClick={() => signIn("google")} className="w-full">
			Sign in with Google
		</Button>
	);
}

export function SignOutButton() {
	return (
		<Button onClick={() => signOut()} variant="outline">
			Sign Out
		</Button>
	);
}

export function UserProfile() {
	const { data: session } = useSession();

	if (!session?.user) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle>Sign In Required</CardTitle>
				</CardHeader>
				<CardContent>
					<SignInButton />
				</CardContent>
			</Card>
		);
	}

	const user = session.user;

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={user.image || ""} alt={user.name || ""} />
						<AvatarFallback>
							{user.name?.charAt(0) || user.email?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-lg font-semibold">{user.name}</p>
						<p className="text-sm text-gray-600">{user.email}</p>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<span>Role:</span>
					<Badge variant="outline">{user.role}</Badge>
				</div>
				{user.expiresAt && (
					<div className="flex items-center justify-between">
						<span>Expires:</span>
						<span className="text-sm text-gray-600">
							{new Date(user.expiresAt).toLocaleDateString()}
						</span>
					</div>
				)}
				<SignOutButton />
			</CardContent>
		</Card>
	);
}
