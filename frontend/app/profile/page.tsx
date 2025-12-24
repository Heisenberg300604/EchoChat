"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Camera,
  Mail,
  User,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Moon,
} from "lucide-react";
import { getMe } from "@/lib/api";
import { setAuthToken } from "@/lib/api";

type UserType = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { icon: Bell, label: "Notifications", description: "Manage your alerts" },
    { icon: Shield, label: "Privacy", description: "Control your privacy settings" },
    { icon: Moon, label: "Appearance", description: "Dark mode, themes" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-foreground">Profile</h1>
        </div>
      </header>

      {!user ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Profile Card */}
          <Card className="bg-card/50 border-border overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/20 to-accent/30" />
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col items-center -mt-12">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground border-4 border-card shadow-xl">
                    {getInitials(user.name)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground border-2 border-card hover:bg-secondary/80 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                  <p className="text-muted-foreground text-sm mt-1">Hey there! I'm using EchoChat</p>
                  <p className="text-muted-foreground/60 text-xs mt-2">
                    Joined {joinedDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Menu */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-2">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/30 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                  {index < menuItems.length - 1 && (
                    <Separator className="mx-4 bg-border/50" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>

          <p className="text-center text-xs text-muted-foreground/50 pb-4">
            EchoChat v1.0.0
          </p>
        </main>
      )}
    </div>
  );
}
