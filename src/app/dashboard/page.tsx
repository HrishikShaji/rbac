import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { UserProfile } from "@/components/AuthComponents";
import { RoleBasedNavigation } from "@/components/RoleBasedNavigation";

export default async function DashboardPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-1">
					<UserProfile />
				</div>
				<div className="lg:col-span-3">
					<RoleBasedNavigation />
				</div>
			</div>
		</div>
	);
}
