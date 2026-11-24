import { t } from "@/i18n/config";
import { tickerItems } from "@/data/placeholder";

// "LIVE" strip inside the top utility bar. Pauses on hover.
export default function LiveTicker({ lang, d }) {
  return (
    <>
      <span className="ticker-label"><span className="dot" />{d.ticker.live}</span>
      <div className="ticker-track">
        <div className="ticker-inner">
          {tickerItems.map((it, i) => (
            <a key={i} href={`/${lang}${it.href}`}>{t(it.text, lang)}</a>
          ))}
        </div>
      </div>
    </>
  );
}
