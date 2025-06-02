import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toast } from "sonner";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("Authorization");

	if (!token) {
		const loginUrl = new URL("/login", request.url);
		toast.warning(
			"Usuário não está logado! Por favor, realize o Login no Sistema."
		);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/home/:path*",
		"/patients/:path*",
		"/documents/:path*",
		"/bills/:path*",
		"/profile/:path*"
	]
};
