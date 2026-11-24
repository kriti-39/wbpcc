import { getDictionary } from "@/i18n/config";
import Hero from "@/components/Hero";
import HappeningNow from "@/components/HappeningNow";
import Groups from "@/components/Groups";
import Leadership from "@/components/Leadership";
import AroundYou from "@/components/AroundYou";
import IntentChips from "@/components/IntentChips";
import NewsroomSection from "@/components/NewsroomSection";
import MoreLinks from "@/components/MoreLinks";
import InspirationRow from "@/components/Inspiration";

// Homepage order (agreed with the party, 24 Nov 2026):
// 1 Hero · 2 What's happening near you · 3 Our organisation · 4 Leadership ·
// 5 Happening around you (campaigns & petitions) · 6 Take action · 7 News corner ·
// 8 About & more · 9 Our inspiration
export default async function Home({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return (
    <>
      <Hero lang={lang} d={d} />
      <HappeningNow lang={lang} h={d.happening} />
      <Groups lang={lang} d={d} />
      <Leadership lang={lang} d={d} />
      <AroundYou lang={lang} d={d} />
      <IntentChips lang={lang} d={d} />
      <NewsroomSection lang={lang} d={d} />
      <MoreLinks lang={lang} d={d} />
      <InspirationRow lang={lang} d={d} />
    </>
  );
}