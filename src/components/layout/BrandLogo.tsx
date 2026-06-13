import Image from "next/image";

import type { SiteSettings } from "@/types/site";

type BrandLogoProps = {
  siteSettings: Pick<SiteSettings, "brandName" | "logoUrl">;
  variant?: "default" | "light";
  className?: string;
  priority?: boolean;
};

const DEFAULT_LOGO = "/mountain-rose-logo-transparent.png";
const DEFAULT_LIGHT_LOGO = "/mountain-rose-logo-transparent.png";

function isSvgSource(src: string) {
  return src.split("?")[0]?.toLowerCase().endsWith(".svg") ?? false;
}

export function BrandLogo({
  siteSettings,
  variant = "default",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const logoSrc =
    siteSettings.logoUrl || (variant === "light" ? DEFAULT_LIGHT_LOGO : DEFAULT_LOGO);

  return (
    <Image
      src={logoSrc}
      alt={`${siteSettings.brandName} logo`}
      width={384}
      height={352}
      className={["h-auto w-auto object-contain", className].join(" ")}
      priority={priority}
      unoptimized={isSvgSource(logoSrc)}
    />
  );
}
