import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import Google from "next-auth/providers/google"
import { UserRole } from "@/generated/prisma";
import { GOOGLE_ID, GOOGLE_SECRET } from "./lib/variables";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: GOOGLE_ID!,
			clientSecret: GOOGLE_SECRET!,
		})
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === "google") {
				try {
					// Check if user exists
					const existingUser = await prisma.user.findUnique({
						where: { email: user.email! }
					});

					if (existingUser) {
						// Check if user is active
						if (!existingUser.isActive) {
							return false; // Deny sign in for inactive users
						}

						// Check if technician role has expired
						if (existingUser.role === UserRole.TECHNICIAN &&
							existingUser.expiresAt &&
							existingUser.expiresAt < new Date()) {
							return false; // Deny sign in for expired technicians
						}
					} else {
						// New user - assign default role as REGULAR
						// You might want to have a different logic for assigning initial roles
						await prisma.user.update({
							where: { email: user.email! },
							data: {
								role: UserRole.REGULAR,
								isActive: true,
							}
						});
					}

					return true;
				} catch (error) {
					console.error("SignIn error:", error);
					return false;
				}
			}
			return true;
		},

		async jwt({ token, user, trigger }) {
			// On sign in or when token is updated
			if (user || trigger === "update") {
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email! },
					include: {
						permissions: true,
						home: true
					}
				});

				if (dbUser) {
					token.role = dbUser.role;
					token.homeId = dbUser.homeId;
					token.isActive = dbUser.isActive;
					token.expiresAt = dbUser.expiresAt;
				}
			}
			return token;
		},

		async session({ session, token }) {
			if (session.user && token) {
				session.user.id = token.sub!;
				session.user.role = token.role as UserRole;
				session.user.homeId = token.homeId as string;
				session.user.isActive = token.isActive as boolean;
				session.user.expiresAt = token.expiresAt as Date;
			}
			return session;
		}
	},
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	session: {
		strategy: "jwt",
	},
	events: {
		async createUser({ user }) {
			// Set default role for new users
			await prisma.user.update({
				where: { id: user.id },
				data: {
					role: UserRole.REGULAR,
					isActive: true,
				}
			});
		}
	}
});
