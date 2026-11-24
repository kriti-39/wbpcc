import { getDictionary } from "@/i18n/config";
import PageHead from "@/components/PageHead";
import TakeAction from "@/components/TakeAction";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).nav.petitions };
}

export default async function PetitionsPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return (
    <>
      <PageHead crumbHref={`/${lang}`} crumbLabel={d.nav.home} eyebrow={d.action.eyebrow} title={d.action.title} lead={d.action.sub} />
      <TakeAction lang={lang} d={d} showHead={false} />
    </>
  );
}
