import { Capability } from "@/generated/prisma";
import { prisma } from "../../../../../../lib/prisma";
import { withAuth } from "../../../../../../lib/rbac";

export const POST = withAuth(async (req, user) => {
	const sceneId = req.url.split("/").slice(-2)[0];

	const scene = await prisma.scene.findFirst({
		where: {
			id: sceneId,
			homeId: user.homeId
		}
	});

	if (!scene) {
		return new Response(JSON.stringify({ error: "Scene not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
	}

	// If user is technician, only allow safe scenes
	if (user.role === "TECHNICIAN" && !scene.isSafe) {
		return new Response(JSON.stringify({ error: "Can only run safe scenes" }), {
			status: 403,
			headers: { "Content-Type": "application/json" }
		});
	}

	// Execute scene logic here...

	return new Response(JSON.stringify({ message: "Scene executed successfully" }), {
		headers: { "Content-Type": "application/json" }
	});
}, Capability.RUN_SCENES);
