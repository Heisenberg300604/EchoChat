"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getMe } from "@/lib/api";
import { setAuthToken } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setAuthToken(token);
    (async () => {
      try {
        const meRes = await getMe();
        setUser(meRes.data);
      } catch (err) {
        console.error("Profile load error:", err);
        router.push("/login");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-2">
          <div className="text-xl font-semibold">Profile</div>
          {!user ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm">ID: {user.id}</div>
              <div className="text-sm">Name: {user.name}</div>
              <div className="text-sm">Email: {user.email}</div>
              {user.createdAt && (
                <div className="text-sm text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleString()}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
