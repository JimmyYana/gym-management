"use client";

import { UserRound } from "lucide-react";
import { useState } from "react";

export function Avatar({ src }: { src: string }) {
  const [failed, setFailed] = useState("");
  if (!/^https?:\/\//i.test(src) || failed === src) {
    return <span className="avatar avatar-fallback"><UserRound size={19} aria-hidden /></span>;
  }

  // External photo URLs are supplied by members and can use different hosts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="avatar" src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(src)} />;
}
