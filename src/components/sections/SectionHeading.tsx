import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "text-center" : "text-left"}>
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase text-mutedRose">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <div className="mt-4 max-w-2xl text-sm leading-7 text-mutedBrown sm:text-base">
          {description}
        </div>
      ) : null}
    </div>
  );
}

