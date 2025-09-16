import { useSession } from "next-auth/react";
import { hasPermission } from "../../../lib/permissions";
import { Capability, PermissionLevel, UserRole } from "@/generated/prisma";

export function usePermissions() {
	const { data: session } = useSession();

	const checkPermission = (
		capability: Capability,
		requiredLevel: PermissionLevel = PermissionLevel.FULL
	): boolean => {
		if (!session?.user?.role) return false;
		return hasPermission(session.user.role, capability, requiredLevel);
	};

	const canInviteUsers = () => checkPermission(Capability.INVITE_REMOVE_USERS);
	const canTransferOwnership = () => checkPermission(Capability.TRANSFER_OWNERSHIP);
	const canCreateAccessPasses = () => checkPermission(Capability.CREATE_ACCESS_PASSES);
	const canControlEnergy = () => checkPermission(Capability.ENERGY_CONTROLS);
	const canControlClimate = () => checkPermission(Capability.CLIMATE_CONTROLS);
	const canControlWater = () => checkPermission(Capability.WATER_SYSTEM);
	const canAccessSecurity = () => checkPermission(Capability.ENTRANCE_SECURITY, PermissionLevel.VIEW_ONLY);
	const canControlSecurity = () => checkPermission(Capability.ENTRANCE_SECURITY);
	const canAccessCameras = () => checkPermission(Capability.CAMERAS);
	const canRunScenes = () => checkPermission(Capability.RUN_SCENES);
	const canCreateScenes = () => checkPermission(Capability.CREATE_EDIT_SCENES);
	const canStartOTA = () => checkPermission(Capability.START_OTA);
	const canApproveRemoteSupport = () => checkPermission(Capability.APPROVE_REMOTE_SUPPORT);

	return {
		checkPermission,
		canInviteUsers,
		canTransferOwnership,
		canCreateAccessPasses,
		canControlEnergy,
		canControlClimate,
		canControlWater,
		canAccessSecurity,
		canControlSecurity,
		canAccessCameras,
		canRunScenes,
		canCreateScenes,
		canStartOTA,
		canApproveRemoteSupport,
		role: session?.user?.role,
		isOwner: session?.user?.role === UserRole.OWNER,
		isAdmin: session?.user?.role === UserRole.ADMIN,
		isTechnician: session?.user?.role === UserRole.TECHNICIAN,
	};
}
