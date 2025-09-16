"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Users,
	Shield,
	Key,
	Zap,
	Thermometer,
	Droplets,
	Camera,
	Play,
	Settings,
	Download,
	HeadphonesIcon
} from "lucide-react";
import { PermissionGuard } from "./PermissionGuard";
import { usePermissions } from "@/app/hooks/usePermissions";
import { Capability } from "@/generated/prisma";

export function RoleBasedNavigation() {
	const { role } = usePermissions();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Smart Home Control</h1>
				<Badge variant="outline" className="text-sm">
					{role}
				</Badge>
			</div>

			{/* User Management */}
			<PermissionGuard capability={Capability.INVITE_REMOVE_USERS}>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							User Management
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							<Button>Invite User</Button>
							<Button variant="outline">Manage Users</Button>
						</div>
					</CardContent>
				</Card>
			</PermissionGuard>

			{/* Access Control */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<PermissionGuard capability={Capability.CREATE_ACCESS_PASSES}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Key className="h-5 w-5" />
								Access Passes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Button className="w-full">Create New Pass</Button>
						</CardContent>
					</Card>
				</PermissionGuard>

				<PermissionGuard capability={Capability.ENTRANCE_SECURITY}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								Security System
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2">
								<Button size="sm">Arm</Button>
								<Button size="sm" variant="outline">Disarm</Button>
							</div>
						</CardContent>
					</Card>
				</PermissionGuard>
			</div>

			{/* System Controls */}
			<Card>
				<CardHeader>
					<CardTitle>System Controls</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<PermissionGuard capability={Capability.ENERGY_CONTROLS}>
							<div className="flex items-center justify-between p-3 border rounded">
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4" />
									<span>Energy</span>
								</div>
								<Button size="sm">Control</Button>
							</div>
						</PermissionGuard>

						<PermissionGuard capability={Capability.CLIMATE_CONTROLS}>
							<div className="flex items-center justify-between p-3 border rounded">
								<div className="flex items-center gap-2">
									<Thermometer className="h-4 w-4" />
									<span>Climate</span>
								</div>
								<Button size="sm">Control</Button>
							</div>
						</PermissionGuard>

						<PermissionGuard capability={Capability.WATER_SYSTEM}>
							<div className="flex items-center justify-between p-3 border rounded">
								<div className="flex items-center gap-2">
									<Droplets className="h-4 w-4" />
									<span>Water</span>
								</div>
								<Button size="sm">Control</Button>
							</div>
						</PermissionGuard>
					</div>
				</CardContent>
			</Card>

			{/* Cameras */}
			<PermissionGuard capability={Capability.CAMERAS}>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Camera className="h-5 w-5" />
							Security Cameras
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							<Button>Live View</Button>
							<Button variant="outline">View Recordings</Button>
						</div>
					</CardContent>
				</Card>
			</PermissionGuard>

			{/* Scenes */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Play className="h-5 w-5" />
						Scenes
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<PermissionGuard capability={Capability.RUN_SCENES}>
							<Button>Run Scene</Button>
						</PermissionGuard>
						<PermissionGuard capability={Capability.CREATE_EDIT_SCENES}>
							<Button variant="outline">Create Scene</Button>
						</PermissionGuard>
					</div>
				</CardContent>
			</Card>

			{/* System Management */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<PermissionGuard capability={Capability.START_OTA}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Download className="h-5 w-5" />
								System Updates
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Button className="w-full">Start OTA Update</Button>
						</CardContent>
					</Card>
				</PermissionGuard>

				<PermissionGuard capability={Capability.APPROVE_REMOTE_SUPPORT}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<HeadphonesIcon className="h-5 w-5" />
								Remote Support
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Button className="w-full">Approve Support Access</Button>
						</CardContent>
					</Card>
				</PermissionGuard>
			</div>

			{/* Ownership Transfer - Only for owners */}
			<PermissionGuard capability={Capability.TRANSFER_OWNERSHIP}>
				<Card className="border-yellow-200 bg-yellow-50">
					<CardHeader>
						<CardTitle className="text-yellow-800">Transfer Ownership</CardTitle>
					</CardHeader>
					<CardContent>
						<Button variant="destructive">Transfer Home Ownership</Button>
					</CardContent>
				</Card>
			</PermissionGuard>
		</div>
	);
}
