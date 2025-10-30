"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet parts to avoid SSR issues
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  {
    ssr: false,
  }
);
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
const useMapEvents = (await import("react")).useEffect ? null : null; // placeholder to satisfy parser

// We set default marker icon URLs via CDN to avoid bundling issues
const ensureLeafletIcons = async () => {
  const L = (await import("leaflet")).default;
  const iconRetinaUrl =
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
  const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
  const shadowUrl =
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
  L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
};

export default function LocationPickerMap({ value, onChange }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    ensureLeafletIcons();
  }, []);

  const center = useMemo(() => {
    if (value?.lat && value?.lng) return [value.lat, value.lng];
    // Default center (Tehran)
    return [35.6892, 51.389];
  }, [value]);

  // Local marker position to allow immediate feedback
  const [position, setPosition] = useState(
    value?.lat && value?.lng ? [value.lat, value.lng] : center
  );

  useEffect(() => {
    if (value?.lat && value?.lng) setPosition([value.lat, value.lng]);
  }, [value]);

  // Lazy import hook from react-leaflet for map events
  const [MapEventsComp, setMapEventsComp] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const rl = await import("react-leaflet");
      const Comp = function MapEvents() {
        const events = rl.useMapEvents({
          click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onChange?.({ lat, lng });
          },
        });
        return null;
      };
      if (mounted) setMapEventsComp(() => Comp);
    })();
    return () => {
      mounted = false;
    };
  }, [onChange]);

  if (!isClient) return null;

  return (
    <div className="space-y-2 overflow-hidden">
      <div className="text-sm text-gray-600">
        Click on the map or move the marker to adjust the position.
      </div>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "320px", width: "100%", borderRadius: 8 }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {MapEventsComp ? <MapEventsComp /> : null}
        {position ? (
          <Marker
            position={position}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const { lat, lng } = marker.getLatLng();
                setPosition([lat, lng]);
                onChange?.({ lat, lng });
              },
            }}
          />
        ) : null}
      </MapContainer>
      <div className="text-xs text-gray-700">
        Lat: {position?.[0]?.toFixed?.(6)} | Lng: {position?.[1]?.toFixed?.(6)}
      </div>
    </div>
  );
}
