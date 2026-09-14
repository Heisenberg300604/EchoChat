"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😜", "🤔", "🙄",
      "😴", "🥳", "😎", "🤩", "😢", "😭", "😡", "🤯", "🥺", "😇",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👍", "👎", "👏", "🙌", "🙏", "💪", "🤝", "👋", "✌️", "🤞",
      "👌", "🤙", "💯", "🔥", "✨", "🎉", "❤️", "💔", "😱", "🤗",
    ],
  },
  {
    label: "Objects",
    emojis: [
      "🎂", "☕", "🍕", "🍔", "🎁", "📷", "🎵", "⚡", "🌟", "🚀",
      "💡", "📌", "✅", "❌", "⏰", "🌈", "☀️", "🌙", "🐶", "🐱",
    ],
  },
];

type Props = {
  onSelect: (emoji: string) => void;
};

export default function EmojiPicker({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground shrink-0"
        title="Emoji"
        onClick={() => setOpen((v) => !v)}
      >
        <Smile className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-12 left-0 z-50 w-72 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-3 scrollbar-thin"
          >
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label} className="mb-3 last:mb-0">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5 px-1">
                  {group.label}
                </p>
                <div className="grid grid-cols-8 gap-1">
                  {group.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                        setOpen(false);
                      }}
                      className="text-xl leading-none rounded-md p-1.5 hover:bg-secondary transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
