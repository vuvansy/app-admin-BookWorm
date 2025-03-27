import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const refresh_token = request.cookies.get("refresh_token")?.value;
    if (!refresh_token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/account`, {
            method: "GET",
            headers: { Authorization: `Bearer ${refresh_token}` },
        });

        if (!res.ok) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const responseData = await res.json();
        const user = responseData?.data?.user;

        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (user.role === "ADMIN") {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL("/login", request.url));

    } catch (error) {
        console.error("Lỗi kiểm tra token:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/", "/admin/account", "/admin/change-password"],
};
