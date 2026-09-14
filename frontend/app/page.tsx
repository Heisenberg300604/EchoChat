"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Users,
  Zap,
  Video,
  Radio,
  Github,
  ArrowRight,
  Check,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE_OUT },
  }),
};

const features = [
  {
    icon: Zap,
    title: "Real-Time, Instantly",
    description:
      "Messages travel over a live WebSocket connection — no polling, no refresh. Type, send, delivered.",
  },
  {
    icon: Users,
    title: "One-to-One Focus",
    description:
      "Built purely for private conversations between two people. No groups, no noise, no distractions.",
  },
  {
    icon: Video,
    title: "Built-in Video Calls",
    description:
      "Jump from a chat straight into a peer-to-peer video call with a single click — no extra app required.",
  },
  {
    icon: Radio,
    title: "Live Presence & Typing",
    description:
      "See who's online right now and know the moment they start typing back.",
  },
  {
    icon: MessageCircle,
    title: "Clean, Fast Interface",
    description:
      "A focused, distraction-free UI that gets out of the way so the conversation stays front and center.",
  },
  {
    icon: Github,
    title: "Open Source",
    description:
      "The entire codebase is public. Inspect it, self-host it, or contribute to it on GitHub.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up in seconds with just your name, email, and a password.",
  },
  {
    step: "02",
    title: "Find someone to talk to",
    description: "Pick anyone from the people already on EchoChat and open a chat.",
  },
  {
    step: "03",
    title: "Chat in real time",
    description: "Send messages, see typing indicators, and hop into a video call instantly.",
  },
];

function ChatMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 via-emerald-500/10 to-transparent blur-3xl rounded-[2rem]" />
      <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            AK
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Aisha K.</p>
            <p className="text-[11px] text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-online" /> Active now
            </p>
          </div>
        </div>
        <div className="p-4 space-y-3 min-h-[220px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex justify-start"
          >
            <div className="bg-secondary text-secondary-foreground text-sm rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[75%]">
              Hey! Did you check out the new design?
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex justify-end"
          >
            <div className="flex flex-col items-end gap-1">
              <div className="bg-primary text-primary-foreground text-sm rounded-2xl rounded-br-md px-4 py-2.5 max-w-[75%]">
                Yes! It looks amazing 🔥
              </div>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground pr-1">
                <CheckCheck className="w-3 h-3 text-primary" /> Delivered
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.4 }}
            className="flex justify-start"
          >
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsChecking(false);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header
        style={{
          backgroundColor: useTransform(
            headerBg,
            [0, 1],
            ["rgba(10,10,10,0)", "rgba(10,10,10,0.7)"]
          ),
        }}
        className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">EchoChat</span>
          </motion.div>
          <nav className="flex items-center space-x-3 md:space-x-6">
            <Link
              href="#features"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
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
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative w-full min-h-[92vh] flex items-center px-4 pt-10 pb-16">
        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-primary/25 blur-[110px] rounded-full"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] bg-emerald-500/20 blur-[110px] rounded-full"
          />
          <motion.div
            animate={{ x: [0, 25, 0], y: [0, 25, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-blue-500/10 blur-[110px] rounded-full"
          />
        </div>

        <div className="relative container mx-auto grid lg:grid-cols-2 gap-16 items-center max-w-6xl">
          <div className="text-center lg:text-left">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground mb-6 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
              Live real-time messaging, built on WebSockets
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground via-primary to-emerald-400 bg-clip-text text-transparent leading-[1.05]"
            >
              One conversation.
              <br />
              Zero distractions.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-xl mx-auto lg:mx-0"
            >
              EchoChat is a focused, one-to-one messaging app with instant delivery,
              live typing indicators, and built-in video calls — no groups, no clutter.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.3}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {!isChecking && (
                isAuthenticated ? (
                  <Link href="/chat">
                    <Button size="lg" className="text-base px-8 py-6 group">
                      Go to Chats
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="text-base px-8 py-6 group">
                        Start Chatting Free
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button size="lg" variant="outline" className="text-base px-8 py-6">
                        I already have an account
                      </Button>
                    </Link>
                  </>
                )
              )}
            </motion.div>
          </div>

          <ChatMockup />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Up and running in a minute</h2>
            <p className="text-muted-foreground text-lg">No setup, no configuration — just sign up and talk.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center text-primary font-bold text-lg mb-5 relative z-10">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why EchoChat?</h2>
            <p className="text-muted-foreground text-lg">Everything a focused conversation needs — nothing it doesn't.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-colors hover:border-primary/40"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="relative container mx-auto max-w-3xl text-center rounded-3xl border border-border/50 bg-gradient-to-b from-card/60 to-card/20 backdrop-blur-sm px-6 py-16 overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-emerald-500/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Ready to start a conversation?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Create your account and message in real time in under a minute.
            </p>
            <Link href={isAuthenticated ? "/chat" : "/register"}>
              <Button size="lg" className="text-base px-8 py-6 group">
                {isAuthenticated ? "Go to Chats" : "Get Started Now"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MessageCircle className="h-4 w-4 text-primary" />
            EchoChat
          </div>
          <p className="text-muted-foreground text-sm">
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
  );
}
