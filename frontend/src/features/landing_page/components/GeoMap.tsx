import 'leaflet/dist/leaflet.css';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const GeoMap = () => (
  <MapContainer center={[47.57, 16.496]} zoom={8} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[47.57, 16.496]}>
      <Popup>
        This is a PermaplanT site. Click <a href="/sites/1">here</a> to visit.
      </Popup>
    </Marker>
  </MapContainer>
);
