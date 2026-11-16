import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Shared rolling label and circular arrow for public-facing actions. */
export function VisualVerseActionContent({children,Icon=ArrowUpRight}:{children:ReactNode;Icon?:LucideIcon}) {
  return <><span className="vv-action-mask"><span className="vv-action-roll"><span>{children}</span><span aria-hidden="true">{children}</span></span></span><span className="vv-action-disc" aria-hidden="true"><Icon size={17} strokeWidth={2}/></span></>;
}
