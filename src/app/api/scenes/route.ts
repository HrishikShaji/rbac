import { Capability } from "@/generated/prisma";
import { prisma } from "../../../../lib/prisma";
import { withAuth } from "../../../../lib/rbac";

export const GET = withAuth(async (req, user) => {
	const url = new URL(req.url);
	const safeOnly = url.searchParams.get("safeOnly") === "true";

	const scenes = await prisma.scene.findMany({
		where: {
			homeId: user.homeId,
			...(safeOnly && { isSafe: true })
		}
	});

	return new Response(JSON.stringify(scenes), {
		headers: { "Content-Type": "application/json" }
	});
}, Capability.RUN_SCENES);
