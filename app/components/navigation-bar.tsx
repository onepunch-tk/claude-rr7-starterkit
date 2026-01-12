import { LogOut, Menu, User as UserIcon } from "lucide-react";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarTrigger } from "~/components/ui/sidebar";
import type { User } from "~/db";

interface UserMenuProps {
	user: User;
}

/**
 * 애플리케이션 헤더
 * - 사이드바 토글
 * - 사용자 메뉴 (프로필, 로그아웃)
 */
function UserMenu({ user }: UserMenuProps) {
	return (
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
					{/* 로그아웃: Form submit으로 변경 */}
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
	);
}

function AuthButtons() {
	return (
		<>
			<Button variant="ghost" asChild>
				<Link to="/auth/signin">로그인</Link>
			</Button>
			<Button asChild>
				<Link to="/auth/signup">시작하기</Link>
			</Button>
		</>
	);
}

interface NavigationBarProps {
	user?: User;
	loading?: boolean;
}

/**
 * 랜딩 페이지 네비게이션 바
 * - 상단 고정
 * - 로그인/시작하기 버튼 제공
 */
export default function NavigationBar({ user, loading }: NavigationBarProps) {
	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* 로고 */}
				<Link to="/" className="flex items-center space-x-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<span className="text-lg font-bold text-primary-foreground">C</span>
					</div>
					<span className="hidden font-bold sm:inline-block">
						Claude RR7 Starterkit
					</span>
				</Link>

				{/* 버튼 영역 */}
				<div className="hidden items-center gap-2 md:flex">
					{loading ? (
						<div className="flex items-center">
							<div className="bg-muted-foreground/20 size-8 animate-pulse rounded-lg" />
						</div>
					) : user ? (
						<UserMenu user={user} />
					) : (
						<AuthButtons />
					)}
				</div>
			</div>
		</nav>
	);
}
