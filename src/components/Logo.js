import Link from "next/link";

// Trilingual wordmark, matching the Figma lockup:
// Bengali / Hindi / English + tricolour underline.
export default function Logo({ lang, size = 46 }) {
  return (
    <Link href={`/${lang}`} className="brand" aria-label="West Bengal Pradesh Congress — home">
      {/* PLACEHOLDER: replace public/brand/logo.svg with the official logo */}
      <img src="/brand/logo.svg" alt="" width={size} height={size} />
      <span className="brand-words">
        <span className="bn">পশ্চিমবঙ্গ প্রদেশ কংগ্রেস</span>
        <span className="hi">पश्चिम बंगाल प्रदेश कांग्रेस</span>
        <span className="en">WEST BENGAL PRADESH CONGRESS</span>
        <span className="tricolour" aria-hidden="true"><span /><span /><span /></span>
      </span>
    </Link>
  );
}
