import { Capability, PermissionLevel, UserRole } from "@/generated/prisma";

export interface PermissionConfig {
	level: PermissionLevel;
	needsApproval?: boolean;
	expirable?: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Record<Capability, PermissionConfig>> = {
	[UserRole.OWNER]: {
		[Capability.INVITE_REMOVE_USERS]: { level: PermissionLevel.FULL },
		[Capability.TRANSFER_OWNERSHIP]: { level: PermissionLevel.FULL },
		[Capability.CREATE_ACCESS_PASSES]: { level: PermissionLevel.FULL },
		[Capability.ENERGY_CONTROLS]: { level: PermissionLevel.FULL },
		[Capability.CLIMATE_CONTROLS]: { level: PermissionLevel.FULL },
		[Capability.WATER_SYSTEM]: { level: PermissionLevel.FULL },
		[Capability.ENTRANCE_SECURITY]: { level: PermissionLevel.FULL },
		[Capability.CAMERAS]: { level: PermissionLevel.FULL },
		[Capability.RUN_SCENES]: { level: PermissionLevel.FULL },
		[Capability.CREATE_EDIT_SCENES]: { level: PermissionLevel.FULL },
		[Capability.START_OTA]: { level: PermissionLevel.FULL },
		[Capability.APPROVE_REMOTE_SUPPORT]: { level: PermissionLevel.FULL },
	},
	[UserRole.ADMIN]: {
		[Capability.INVITE_REMOVE_USERS]: { level: PermissionLevel.FULL },
		[Capability.TRANSFER_OWNERSHIP]: { level: PermissionLevel.NONE },
		[Capability.CREATE_ACCESS_PASSES]: { level: PermissionLevel.FULL },
		[Capability.ENERGY_CONTROLS]: { level: PermissionLevel.FULL },
		[Capability.CLIMATE_CONTROLS]: { level: PermissionLevel.FULL },
		[Capability.WATER_SYSTEM]: { level: PermissionLevel.FULL },
		[Capability.ENTRANCE_SECURITY]: { level: PermissionLevel.FULL },
		[Capability.CAMERAS]: { level: PermissionLevel.FULL },
		[Capability.RUN_SCENES]: { level: PermissionLevel.FULL },
		[Capability.CREATE_EDIT_SCENES]: { level: PermissionLevel.FULL },
		[Capability.START_OTA]: { level: PermissionLevel.FULL },
		[Capability.APPROVE_REMOTE_SUPPORT]: { level: PermissionLevel.FULL },
	},
	[UserRole.CO_OWNER]: {
		[Capability.INVITE_REMOVE_USERS]: { level: PermissionLevel.NONE },
		[Capability.TRANSFER_OWNERSHIP]: { level: PermissionLevel.NONE },
		[Capability.CREATE_ACCESS_PASSES]: { level: PermissionLevel.NONE },
		[Capability.ENERGY_CONTROLS]: { level: PermissionLevel.LIMITED },
		[Capability.CLIMATE_CONTROLS]: { level: PermissionLevel.LIMITED },
		[Capability.WATER_SYSTEM]: { level: PermissionLevel.LIMITED },
		[Capability.ENTRANCE_SECURITY]: { level: PermissionLevel.VIEW_ONLY },
		[Capability.CAMERAS]: { level: PermissionLevel.NONE },
		[Capability.RUN_SCENES]: { level: PermissionLevel.FULL },
		[Capability.CREATE_EDIT_SCENES]: { level: PermissionLevel.NONE },
		[Capability.START_OTA]: { level: PermissionLevel.NONE },
		[Capability.APPROVE_REMOTE_SUPPORT]: { level: PermissionLevel.NONE },
	},
	[UserRole.REGULAR]: {
		[Capability.INVITE_REMOVE_USERS]: { level: PermissionLevel.NONE },
		[Capability.TRANSFER_OWNERSHIP]: { level: PermissionLevel.NONE },
		[Capability.CREATE_ACCESS_PASSES]: { level: PermissionLevel.NONE },
		[Capability.ENERGY_CONTROLS]: { level: PermissionLevel.NONE },
		[Capability.CLIMATE_CONTROLS]: { level: PermissionLevel.NONE },
		[Capability.WATER_SYSTEM]: { level: PermissionLevel.NONE },
		[Capability.ENTRANCE_SECURITY]: { level: PermissionLevel.VIEW_ONLY },
		[Capability.CAMERAS]: { level: PermissionLevel.NONE },
		[Capability.RUN_SCENES]: { level: PermissionLevel.FULL },
		[Capability.CREATE_EDIT_SCENES]: { level: PermissionLevel.NONE },
		[Capability.START_OTA]: { level: PermissionLevel.NONE },
		[Capability.APPROVE_REMOTE_SUPPORT]: { level: PermissionLevel.NONE },
	},
	[UserRole.TECHNICIAN]: {
		[Capability.INVITE_REMOVE_USERS]: { level: PermissionLevel.NONE },
		[Capability.TRANSFER_OWNERSHIP]: { level: PermissionLevel.NONE },
		[Capability.CREATE_ACCESS_PASSES]: { level: PermissionLevel.NONE },
		[Capability.ENERGY_CONTROLS]: { level: PermissionLevel.FULL, expirable: true },
		[Capability.CLIMATE_CONTROLS]: { level: PermissionLevel.FULL, expirable: true },
		[Capability.WATER_SYSTEM]: { level: PermissionLevel.FULL, expirable: true },
		[Capability.ENTRANCE_SECURITY]: { level: PermissionLevel.FULL, needsApproval: true, expirable: true },
		[Capability.CAMERAS]: { level: PermissionLevel.NONE },
		[Capability.RUN_SCENES]: { level: PermissionLevel.LIMITED, expirable: true }, // Safe scenes only
		[Capability.CREATE_EDIT_SCENES]: { level: PermissionLevel.NONE },
		[Capability.START_OTA]: { level: PermissionLevel.NONE },
		[Capability.APPROVE_REMOTE_SUPPORT]: { level: PermissionLevel.NONE },
	},
};

export function getUserPermission(role: UserRole, capability: Capability): PermissionConfig {
	return ROLE_PERMISSIONS[role][capability];
}

export function hasPermission(
	role: UserRole,
	capability: Capability,
	requiredLevel: PermissionLevel = PermissionLevel.FULL
): boolean {
	const permission = getUserPermission(role, capability);

	if (permission.level === PermissionLevel.NONE) return false;
	if (requiredLevel === PermissionLevel.VIEW_ONLY) return permission.level !== PermissionLevel.NONE;
	if (requiredLevel === PermissionLevel.LIMITED) {
		return permission.level === PermissionLevel.LIMITED || permission.level === PermissionLevel.FULL;
	}
	if (requiredLevel === PermissionLevel.FULL) return permission.level === PermissionLevel.FULL;

	return false;
}
