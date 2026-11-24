import { getDictionary } from "@/i18n/config";
import PageHead from "@/components/PageHead";
import Groups from "@/components/Groups";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).org.title };
}

export default async function OrganisationPage({ params }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return (
    <>
      <PageHead crumbHref={`/${lang}`} crumbLabel={d.nav.home} eyebrow={d.org.eyebrow} title={d.org.title} lead={d.org.lead} />
      <Groups lang={lang} d={d} showHead={false} full />
    </>
  );
}
