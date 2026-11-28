import { Suspense } from "react";
import NextMatchesSection from "./NextMatchesSection";
import GroupPreview from "./GroupPreview";

interface PreviewSectionsProps {
  slug: string;
}

export default function PreviewSections({ slug }: PreviewSectionsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Suspense fallback={<div className="text-slate-stone">Laden...</div>}>
        <NextMatchesSection />
      </Suspense>
      <GroupPreview />
    </div>
  );
}
