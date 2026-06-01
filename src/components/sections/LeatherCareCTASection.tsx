import type { SiteSettings } from "@/types/site";

import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

type LeatherCareCTASectionProps = {
  siteSettings: Pick<SiteSettings, "whatsappNumber">;
};

export default function LeatherCareCTASection({
  siteSettings,
}: LeatherCareCTASectionProps) {
  return (
    <section className="bg-espresso text-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase text-dustyRose">
              Help
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-bone sm:text-4xl">
              Need Leather Care Guidance?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-bone/85 sm:text-base">
              Contact Mountain Rose for care advice that fits the character of your
              leather bag.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-warmIvory/10 bg-darkLeather p-6">
              <WhatsAppButton
                phoneNumber={siteSettings.whatsappNumber}
                label="Consult via WhatsApp"
              />
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase text-bone/70">
                <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
                Calm consultation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
