import { NextRequest } from "next/server";
import { hasPermission } from "./permissions";
import { prisma } from "./prisma";
import { Capability, PermissionLevel, UserRole } from "@/generated/prisma";
import { auth } from "../auth";

export interface AuthorizedUser {
	id: string;
	role: UserRole;
	homeId?: string;
	permissions?: any[];
}

export async function checkPermission(
	capability: Capability,
	requiredLevel: PermissionLevel = PermissionLevel.FULL
): Promise<{ authorized: boolean; user?: AuthorizedUser; error?: string }> {
	const session = await auth();

	if (!session?.user) {
		return { authorized: false, error: "Not authenticated" };
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: { permissions: true }
	});

	if (!user || !user.isActive) {
		return { authorized: false, error: "User not found or inactive" };
	}

	// Check role expiration for technicians
	if (user.role === UserRole.TECHNICIAN && user.expiresAt && user.expiresAt < new Date()) {
		return { authorized: false, error: "Access expired" };
	}

	// Check base role permission
	if (!hasPermission(user.role, capability, requiredLevel)) {
		return { authorized: false, error: "Insufficient permissions" };
	}

	// Check specific user permissions for overrides
	const userPermission = user.permissions.find(p => p.capability === capability);
	if (userPermission) {
		if (userPermission.expiresAt && userPermission.expiresAt < new Date()) {
			return { authorized: false, error: "Permission expired" };
		}

		if (userPermission.needsApproval) {
			// In a real app, you'd check for pending approvals
			return { authorized: false, error: "Approval required" };
		}
	}

	return {
		authorized: true,
		user: {
			id: user.id,
			role: user.role,
			homeId: user.homeId || undefined,
			permissions: user.permissions
		}
	};
}

// API route wrapper
export function withAuth(
	handler: (req: NextRequest, user: AuthorizedUser) => Promise<Response>,
	capability?: Capability,
	requiredLevel?: PermissionLevel
) {
	return async (req: NextRequest) => {
		if (capability) {
			const { authorized, user, error } = await checkPermission(capability, requiredLevel);

			if (!authorized) {
				return new Response(JSON.stringify({ error }), {
					status: 403,
					headers: { "Content-Type": "application/json" }
				});
			}

			return handler(req, user!);
		}

		// If no capability specified, just check authentication
		const session = await auth();
		if (!session?.user) {
			return new Response(JSON.stringify({ error: "Not authenticated" }), {
				status: 401,
				headers: { "Content-Type": "application/json" }
			});
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			include: { permissions: true }
		});

		if (!user) {
			return new Response(JSON.stringify({ error: "User not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
		}

		return handler(req, {
			id: user.id,
			role: user.role,
			homeId: user.homeId || undefined,
			permissions: user.permissions
		});
	};
}
