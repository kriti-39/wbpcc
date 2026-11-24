import { getDictionary } from "@/i18n/config";
import { campaigns } from "@/data/placeholder";
import PageHead from "@/components/PageHead";
import CampaignCard from "@/components/CampaignCard";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).campaign.listTitle };
}

export default async function CampaignsPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const s = d.campaign;
  return (
    <>
      <PageHead crumbHref={`/${lang}/events`} crumbLabel={d.nav.events} eyebrow={s.eyebrow} title={s.listTitle} lead={s.listLead} />
      <section className="section deco deco-b">
        <div className="wrap camp-grid">
          {campaigns.map((c, i) => <CampaignCard key={c.id} c={c} lang={lang} s={s} i={i} />)}
        </div>
      </section>
    </>
  );
}
