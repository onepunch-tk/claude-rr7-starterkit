import { LogOut, Menu, User as UserIcon } from "lucide-react";
import { Form, Outlet, useOutletContext } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import type { User } from "~/db/schema";

/**
 * 대시보드 레이아웃
 * - private.layout에서 인증 처리됨
 * - 사이드바 + 헤더 + 메인 컨텐츠 구조
 */
export default function DashboardLayout() {
	const { user } = useOutletContext<{ user: User }>();

	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar />
				<div className="flex flex-1 flex-col">
					{/* 헤더 */}
					<header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
						<SidebarTrigger>
							<Menu className="h-5 w-5" />
						</SidebarTrigger>
						<div className="flex-1" />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="rounded-full">
									<UserIcon className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>
									<div className="flex flex-col">
										<span className="font-medium">{user.email}</span>
										<span className="text-xs text-muted-foreground">
											{user.name ?? "사용자"}
										</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<Form method="post" action="/auth/signout">
									<DropdownMenuItem asChild>
										<button type="submit" className="w-full cursor-pointer">
											<LogOut className="mr-2 h-4 w-4" />
											로그아웃
										</button>
									</DropdownMenuItem>
								</Form>
							</DropdownMenuContent>
						</DropdownMenu>
					</header>

					{/* 메인 컨텐츠 */}
					<main className="flex-1 p-6">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
