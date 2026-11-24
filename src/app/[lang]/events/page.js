import { getDictionary } from "@/i18n/config";
import PageHead from "@/components/PageHead";
import HappeningNow from "@/components/HappeningNow";
import CampaignStrip from "@/components/CampaignStrip";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).nav.events };
}

export default async function EventsPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const h = d.happening;
  return (
    <>
      <PageHead crumbHref={`/${lang}`} crumbLabel={d.nav.home} eyebrow={h.eyebrow} title={h.title} lead={h.sub} />
      <HappeningNow lang={lang} h={h} showHead={false} layout="grid"><CampaignStrip lang={lang} s={d.campaign} /></HappeningNow>
    </>
  );
}
