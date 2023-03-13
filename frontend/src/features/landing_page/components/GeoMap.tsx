import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

export const GeoMap = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[51.505, -0.09]}>
      <Popup>
        This is a PermaPlanT site. Click <a href="/sites/1">here</a> to visit.
      </Popup>
    </Marker>
  </MapContainer>
);
