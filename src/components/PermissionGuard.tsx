import { usePermissions } from "@/app/hooks/usePermissions";
import { Capability, PermissionLevel } from "@/generated/prisma";
import { ReactNode } from "react";

interface PermissionGuardProps {
	capability: Capability;
	requiredLevel?: PermissionLevel;
	children: ReactNode;
	fallback?: ReactNode;
}

export function PermissionGuard({
	capability,
	requiredLevel = PermissionLevel.FULL,
	children,
	fallback = null
}: PermissionGuardProps) {
	const { checkPermission } = usePermissions();

	if (!checkPermission(capability, requiredLevel)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
