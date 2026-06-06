"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { Location } from "@/types/locations";

type FindCarWashMapProps = {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
};

//Hard coded koordinater til lokationer
const locationCoordinates: Record<string, [number, number]> = {
  Højbjerg: [56.1196, 10.1908],
  Lystrup: [56.224754, 10.236637],
  Tilst: [56.1896, 10.1098],
  Horsens: [55.8334616, 9.8064784],
  Viby: [56.1293, 10.1547],
  Taastrup: [55.6580341, 12.2969005],
};

const washWorldIcon = L.divIcon({
  className: "washworld-map-marker",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function FindCarWashMap({ locations, onSelectLocation }: FindCarWashMapProps) {
  return (
    <MapContainer center={[53.05, 10.1]} zoom={6} zoomControl={false} attributionControl={false} className="h-full w-full" style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.map((location) => {
        const coordinates = locationCoordinates[location.location_name];

        if (!coordinates) {
          return null;
        }

        return (
          <Marker
            key={location.location_pk}
            position={coordinates}
            icon={washWorldIcon}
            eventHandlers={{
              click: () => onSelectLocation(location),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
