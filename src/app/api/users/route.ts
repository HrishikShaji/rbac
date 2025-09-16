import { Capability } from "@/generated/prisma";
import { prisma } from "../../../../lib/prisma";
import { withAuth } from "../../../../lib/rbac";

export const GET = withAuth(async (req, user) => {
	const users = await prisma.user.findMany({
		where: { homeId: user.homeId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true,
			expiresAt: true,
			createdAt: true
		}
	});

	return new Response(JSON.stringify(users), {
		headers: { "Content-Type": "application/json" }
	});
}, Capability.INVITE_REMOVE_USERS);

export const POST = withAuth(async (req, user) => {
	const body = await req.json();
	const { email, name, role } = body;

	const newUser = await prisma.user.create({
		data: {
			email,
			name,
			role,
			homeId: user.homeId,
			isActive: true
		}
	});

	return new Response(JSON.stringify(newUser), {
		status: 201,
		headers: { "Content-Type": "application/json" }
	});
}, Capability.INVITE_REMOVE_USERS);
