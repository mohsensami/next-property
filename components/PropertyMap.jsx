"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import only the React-Leaflet parts (disable SSR completely)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState("35");
  const [lng, setLng] = useState("45");
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    // Import Leaflet only on the client
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setCustomIcon(icon);
    });

    const fetchCoords = async () => {
      try {
        const address = `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );

        const data = await res.json();

        if (data.length === 0) {
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setLat(lat);
        setLng(lng);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setGeocodeError(true);
        setLoading(false);
      }
    };

    fetchCoords();
  }, [property]);

  if (loading) return <p>Loading map...</p>;
  //   if (geocodeError || !lat || !lng)
  //     return <p>Could not load map for this property.</p>;

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {customIcon && (
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
              <strong>{property.name}</strong>
              <br />
              {property.location.street}, {property.location.city},{" "}
              {property.location.state}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
