"use client";

import Link from "next/link";

import { buildWhatsAppLink } from "@/lib/whatsapp";

type Variant = "inline" | "floating";

type WhatsAppButtonProps = {
  phoneNumber: string;
  message?: string;
  label?: string;
  variant?: Variant;
  className?: string;
};

const DEFAULT_LABEL = "Konsultasi via WhatsApp";
const DEFAULT_MESSAGE =
  "Halo Mountain Rose, saya tertarik dengan produk tas kulit sapi.";

export function WhatsAppButton({
  phoneNumber,
  message = DEFAULT_MESSAGE,
  label = DEFAULT_LABEL,
  variant = "inline",
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(phoneNumber, message);
  const ariaLabel = label || DEFAULT_LABEL;

  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-soft border text-sm font-medium transition-colors focus-visible:outline-none";

  const premium =
    "border-brass/40 bg-espresso text-warmIvory hover:bg-darkLeather focus-visible:ring-2 focus-visible:ring-antiqueGold/70";

  const floating =
    "fixed bottom-6 right-6 z-50 h-12 px-5 shadow-soft md:bottom-8 md:right-8";

  const inline = "h-10 px-4";

  const finalClassName = [
    base,
    premium,
    variant === "floating" ? floating : inline,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={finalClassName}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </Link>
  );
}

export default WhatsAppButton;
