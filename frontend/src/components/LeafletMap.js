"use client";

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

const customIcon = L.icon({
  iconUrl: '/mapMarker/marker-icon.png',
  shadowUrl: '/mapMarker/marker-shadow.png',
  iconSize: [25, 41], // default leaflet size
  iconAnchor: [12, 41], // point yang akan digunakan sebagai titik koordinat
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_COORDS = { lat: -6.18, lng: 106.82 }; // fallback lokasi (Jakarta)
const zoomSize = 16;

function SetMapToUserLocation({ setCoords }) {
  const map = useMap();

  useEffect(() => {
    if (navigator.onLine && "geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          map.setView([lat, lng], zoomSize);
          setCoords({ lat, lng });
        },
        () => {
          // Gagal ambil lokasi (misal user tolak akses)
          map.setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], zoomSize);
          setCoords(DEFAULT_COORDS);
        }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      // Offline
      map.setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], zoomSize);
      setCoords(DEFAULT_COORDS);
    }
  }, [map, setCoords]);

  return null;
}

function MouseCoordinates() {
  const [position, setPosition] = useState({ lat: null, lng: null });

  useMapEvents({
    mousemove(e) {
      setPosition({
        lat: e.latlng.lat.toFixed(6),
        lng: e.latlng.lng.toFixed(6),
      });
    },
  });

  return (
    <div className="absolute bottom-2 left-2 bg-white text-xs text-gray-700 p-1 rounded shadow z-[1000]">
      {position.lat && position.lng ? (
        <span>
          Lat: {position.lat}, Lng: {position.lng}
        </span>
      ) : (
        <span>Arahkan mouse ke peta</span>
      )}
    </div>
  );
}

export default function LeafletMap() {
  const [userCoords, setUserCoords] = useState(DEFAULT_COORDS);

  return (
    <div className="h-full w-full">
      <MapContainer
        // center={[userCoords.lat, userCoords.lng]}
        // zoom={zoomSize}
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SetMapToUserLocation setCoords={setUserCoords} />
        <MouseCoordinates />
        <Marker position={[userCoords.lat, userCoords.lng]} icon={customIcon}>
          <Popup>GCS Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
