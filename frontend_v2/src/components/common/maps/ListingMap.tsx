// components/map/ListingMap.tsx
"use client";

import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polyline,
  Popup,
} from "react-leaflet";
import { divIcon, LatLngExpression } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin, GraduationCap, ShieldCheck, MapPinOff } from "lucide-react";
import "leaflet/dist/leaflet.css";
import IsSatelliteButton from "@/components/student/results/buttons/IsSatelliteButton";

// --- Icon Helper ---
const createLeafletIcon = (icon: React.ReactElement, color: string) => {
  const html = renderToStaticMarkup(
    <div
      style={{ color }}
      className="relative -top-4 -left-4 w-9 h-9 drop-shadow-lg transition-transform hover:scale-110"
    >
      {/* White circle background to make the icon pop against detailed streets */}
      <div className="absolute inset-0 bg-white rounded-full opacity-30 blur-sm scale-75 z-0" />
      <div className="relative z-10 filter drop-shadow-sm">{icon}</div>
    </div>
  );

  return divIcon({
    html,
    className: "bg-transparent",
    iconSize: [36, 36], // Slightly larger for visibility
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const ListingMap: React.FC<{
  listing: Listing;
  is_approximate?: boolean;
}> = ({ listing, is_approximate = true }) => {
  const [isSatellite, setIsSatellite] = useState(false);

  if (
    !listing.location ||
    !listing.location.lat ||
    !listing.location.lon ||
    !listing.campus_location ||
    !listing.campus_location.lat ||
    !listing.campus_location.lon
  )
    return <MapError />;

  // Coordinates
  const listingPos: LatLngExpression = [
    listing.location?.lat,
    listing.location?.lon,
  ];
  const campusPos: LatLngExpression = [
    listing.campus_location?.lat,
    listing.campus_location?.lon,
  ];

  /// 1. TILE LAYER: Standard OpenStreetMap
  const tileConfig = isSatellite
    ? {
        // Satellite (Esri World Imagery)
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri",
        lineColor: "#ffffff", // White line for dark satellite background
        circleColor: "#4ade80", // Bright neon green for visibility
        markerColor: "#ffffff", // White icons
      }
    : {
        // Standard (OpenStreetMap)
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: "&copy; OpenStreetMap",
        lineColor: "#334155", // Dark Slate line for light map background
        circleColor: "#166534", // Dark green border
        markerColor: "currentColor", // Standard colors
      };

  return (
    <>
      <IsSatelliteButton
        isSatellite={isSatellite}
        setIsSatellite={setIsSatellite}
      />
      <MapContainer
        center={listingPos}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full bg-slate-100"
      >
        <TileLayer
          key={isSatellite ? "sat" : "std"}
          url={tileConfig.url}
          maxZoom={isSatellite ? 17 : 19}
        />

        {/* 2. CAMPUS MARKER (Blue) */}
        <Marker
          position={campusPos}
          icon={createLeafletIcon(
            <GraduationCap size={32} fill="currentColor" />,
            "#2563eb"
          )} // Blue-600
        >
          <Popup className="font-sans font-bold text-sm">
            University Campus
          </Popup>
        </Marker>

        {/* 3. LISTING MARKER */}
        {is_approximate ? (
          // A. Privacy Mode: Green Circle
          <Circle
            center={listingPos}
            pathOptions={{
              fillColor: "#22c55e", // Green-500
              fillOpacity: isSatellite ? 0.3 : 0.2,
              color: tileConfig.circleColor,
              weight: isSatellite ? 3 : 2,
              dashArray: "6, 6",
            }}
            radius={200}
          >
            <Popup className="font-sans text-sm">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="font-bold">Approximate Location</span>
              </div>
              <p className="text-xs text-slate-500 m-0">
                Exact address hidden for privacy.
              </p>
            </Popup>
          </Circle>
        ) : (
          // B. Exact Mode: Red Pin
          <Marker
            position={listingPos}
            icon={createLeafletIcon(
              <MapPin size={32} fill={tileConfig.markerColor} />,
              "#dc2626"
            )} // Red-600
          >
            <Popup className="font-sans font-bold text-sm">
              {listing.title}
            </Popup>
          </Marker>
        )}

        {/* 4. CONNECTION LINE */}
        {/* Changed to Dark Slate Blue so it is visible on the light map */}
        <Polyline
          positions={[listingPos, campusPos]}
          pathOptions={{
            color: tileConfig.lineColor,
            weight: 4,
            dashArray: "10, 10",
            opacity: 0.8,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      </MapContainer>
    </>
  );
};

export default ListingMap;

function MapError() {
  return (
    <div className="w-full h-7/12 sm:h-3/4 grid bg-slate-50 dark:bg-slate-800 items-center justify-center text-center animate-in fade-in relative overflow-hidden group/error">
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 flex items-center justify-center mb-3 group-hover/error:scale-110 transition-transform duration-300">
          <MapPinOff className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Map Unavailable
        </p>
        <p className="text-xxs text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-[150px] leading-relaxed">
          We couldn't load the map view at this time.
        </p>
      </div>
    </div>
  );
}
