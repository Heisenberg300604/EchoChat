"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, MessageCircle, Users, Zap, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsChecking(false);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">EchoChat</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            {!isChecking && (
              isAuthenticated ? (
                <Link href="/chat">
                  <Button variant="default" size="sm">
                    Go to Chats
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="default" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-emerald-500/15 to-blue-500/20 blur-3xl rounded-full scale-150"></div>
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse"></div>
            <h1 className="relative text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground via-primary to-emerald-400 bg-clip-text text-transparent">
              Secure Chat,
              <span className="text-primary"> Simplified</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Experience truly private one-to-one messaging with end-to-end encryption. Your conversations stay between
            you and your contact, always.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isChecking && (
              isAuthenticated ? (
                <Link href="/chat">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Go to Chats
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Chatting Securely
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose EchoChat?</h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">Built with privacy and security at its core</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-muted-foreground">
                  Your messages are encrypted before they leave your device. Only you and your contact can read them.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">One-to-One Focus</h3>
                <p className="text-muted-foreground">
                  Designed specifically for private conversations between two people. No groups, no distractions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Data Collection</h3>
                <p className="text-muted-foreground">
                  We dont store your messages or personal data. Your privacy is guaranteed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Optimized for speed without compromising security. Messages delivered instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <Lock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Self-Destructing Messages</h3>
                <p className="text-muted-foreground">
                  Set messages to automatically delete after a specified time for ultimate privacy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Simple Interface</h3>
                <p className="text-muted-foreground">
                  Clean, intuitive design that focuses on what matters most - your conversation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Chat Securely?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust EchoChat for their private conversations.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/Heisenberg300604/EchoChat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Heisenberg
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
