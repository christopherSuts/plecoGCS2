'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap() {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[-6.1805, 106.8280]}
        zoom={18}
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
