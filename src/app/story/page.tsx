import type { Metadata } from "next";

import CraftsmanshipSection from "@/components/sections/CraftsmanshipSection";
import LeatherMaterialStory from "@/components/sections/LeatherMaterialStory";
import RosePhilosophySection from "@/components/sections/RosePhilosophySection";
import StoryCTASection from "@/components/sections/StoryCTASection";
import StoryHero from "@/components/sections/StoryHero";
import StoryIntro from "@/components/sections/StoryIntro";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { FALLBACK_STORY } from "@/data/fallbackStory";
import { getBrandStory } from "@/data-access/story";
import { getSiteSettings } from "@/data-access/siteSettings";

export const metadata: Metadata = {
  title: "The Mountain Rose Story | Premium Cow Leather Bags",
  description:
    "Discover the Mountain Rose story: premium cow leather bags with handmade Indonesian character and restrained rose-inspired elegance.",
};

export default async function StoryPage() {
  const [cmsStory, cmsSiteSettings] = await Promise.all([
    getBrandStory(),
    getSiteSettings(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const story = {
    ...FALLBACK_STORY,
    ...(cmsStory || {}),
  };

  return (
    <div className="bg-warmIvory">
      <StoryHero story={story} />
      <StoryIntro intro={story.intro || FALLBACK_STORY.intro || ""} />
      <CraftsmanshipSection
        title={story.craftsmanshipTitle || FALLBACK_STORY.craftsmanshipTitle || ""}
        text={story.craftsmanshipText || FALLBACK_STORY.craftsmanshipText || ""}
      />
      <LeatherMaterialStory
        title={story.leatherTitle || FALLBACK_STORY.leatherTitle || ""}
        text={story.leatherText || FALLBACK_STORY.leatherText || ""}
      />
      <RosePhilosophySection
        title={story.roseTitle || FALLBACK_STORY.roseTitle || ""}
        text={story.roseText || FALLBACK_STORY.roseText || ""}
      />
      <StoryCTASection
        title={story.ctaTitle || FALLBACK_STORY.ctaTitle || ""}
        text={story.ctaText || FALLBACK_STORY.ctaText || ""}
        siteSettings={siteSettings}
      />
    </div>
  );
}
