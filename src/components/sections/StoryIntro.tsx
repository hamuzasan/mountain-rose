type StoryIntroProps = {
  intro: string;
};

export default function StoryIntro({ intro }: StoryIntroProps) {
  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase text-mutedRose">
            Introduction
          </div>
          <p className="mt-5 text-base leading-8 text-mutedBrown sm:text-lg">
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
}

