import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/** Aceternity UI Encrypted Text pattern (encrypted-text demo 2),
 * adapted from the documented public API with a completion signal, bounded
 * animation cost, and stable per-character geometry for the startup gate. */
type EncryptedTextProps = {
  text: string;
  className?: string;
  revealDelayMs?: number;
  flipDelayMs?: number;
  charset?: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
};

const defaultCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*+";
const encrypt = (text: string, count: number, charset: string) =>
  Array.from(text, (char, index) => index < count || /\s/.test(char)
    ? char
    : charset[Math.floor(Math.random() * charset.length)]).join("");

export function EncryptedText({
  text, className, revealDelayMs = 24, flipDelayMs = 45,
  charset = defaultCharset, encryptedClassName, revealedClassName,
  onComplete, onProgress,
}: EncryptedTextProps) {
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const length = Array.from(text).length;
  const alphabet = charset || defaultCharset;
  const [frame, setFrame] = useState(() => ({
    count: reduced ? length : 0,
    value: reduced ? text : encrypt(text, 0, alphabet),
  }));
  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    const delay = Math.max(1, revealDelayMs);
    const tick = () => {
      const count = Math.min(length, Math.floor((performance.now() - start) / delay));
      setFrame({ count, value: count === length ? text : encrypt(text, count, alphabet) });
      if (count === length) window.clearInterval(timer);
    };
    const timer = window.setInterval(tick, Math.max(16, flipDelayMs));
    return () => window.clearInterval(timer);
  }, [text, length, alphabet, reduced, revealDelayMs, flipDelayMs]);
  useLayoutEffect(() => {
    onProgress?.(length ? frame.count / length : 1);
    if (frame.count === length) onComplete?.();
  }, [frame.count, length, onComplete, onProgress]);
  let offset = 0;
  return <span className={cn("vv-boot-encrypted", className)} aria-hidden="true">
    {text.split(" ").map((word, wordIndex) => {
      const start = offset;
      offset += word.length + 1;
      return <span key={wordIndex}>{wordIndex > 0 ? " " : null}<span className="vv-boot-word">{Array.from(word).map((letter, index) => {
        const position = start + index;
        const revealed = position < frame.count;
        return <span key={index} className="vv-boot-letter">
          <span className="vv-boot-letter-base">{letter}</span>
          <span className={cn("vv-boot-letter-display", revealed ? revealedClassName : encryptedClassName)}>{frame.value[position] ?? letter}</span>
        </span>;
      })}</span></span>;
    })}
  </span>;
}
