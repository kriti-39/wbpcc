"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { t } from "@/i18n/config";

// Free OpenStreetMap tiles — no API key needed.
const WB_BOUNDS = [[21.5, 85.8], [27.3, 89.9]];

const pin = (kind) =>
  L.divIcon({ className: "", html: `<div class="pin pin-${kind}"><span></span></div>`, iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -10] });

// Keeps the map sized correctly and zoomed to whatever is listed.
// (Without invalidateSize the map drew before its box had a height,
//  which is why it showed Tibet instead of Bengal.)
function FitView({ points, single }) {
  const map = useMap();
  useEffect(() => {
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);
  const key = points.map((p) => p.join(",")).join("|");
  useEffect(() => {
    map.invalidateSize();
    if (points.length === 1) map.setView(points[0], single ? 13 : 10, { animate: true });
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 10 });
    else map.fitBounds(WB_BOUNDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}

export default function EventsMap({ events, offices = [], lang, labels, userPos, single = false, focus = null }) {
  const points = focus || events.map((e) => [e.lat, e.lng]);
  return (
    <MapContainer bounds={WB_BOUNDS} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitView points={points} single={single} />
      {offices.map((o) => (
        <Marker key={o.id} position={[o.lat, o.lng]} icon={pin("office")}>
          <Popup><b>{t(o.name, lang)}</b><br />{labels.office}</Popup>
        </Marker>
      ))}
      {events.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={pin(e.status === "live" ? "live" : "soon")}>
          <Popup>
            <b><a href={`/${lang}/events/${e.id}`}>{t(e.title, lang)}</a></b>
            <br />
            {t(e.place, lang)}
            <br />
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`} target="_blank" rel="noopener noreferrer">
              {labels.directions} ↗
            </a>
          </Popup>
        </Marker>
      ))}
      {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={pin("soon")} />}
    </MapContainer>
  );
}
