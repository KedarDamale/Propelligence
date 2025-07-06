"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLogin from "./login/page";

export default function AdminRootPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin-auth") === "true") {
      router.replace("/admin/panel");
    }
  }, [router]);
  return <AdminLogin />;
}
