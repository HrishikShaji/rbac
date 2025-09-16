import { UserRole } from "@/generated/prisma";

declare module "next-auth" {
	interface User {
		role?: UserRole;
		homeId?: string;
		isActive?: boolean;
		expiresAt?: Date;
	}

	interface Session {
		user: {
			id: string;
			email: string;
			name?: string;
			image?: string;
			role: UserRole;
			homeId?: string;
			isActive: boolean;
			expiresAt?: Date;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: UserRole;
		homeId?: string;
		isActive?: boolean;
		expiresAt?: Date;
	}
}
