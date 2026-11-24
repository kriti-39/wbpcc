import Link from "next/link";

export default function PageHead({ crumbHref, crumbLabel, eyebrow, title, lead, badges }) {
  return (
    <section className="page-head">
      <div className="wrap">
        {crumbHref && <Link href={crumbHref} className="crumb">← {crumbLabel}</Link>}
        {badges && <div className="badges">{badges}</div>}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  );
}
