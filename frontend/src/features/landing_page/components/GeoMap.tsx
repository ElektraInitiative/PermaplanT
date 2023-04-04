import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useDarkModeStore } from '@/features/dark_mode';

export const GeoMap = () => {
  const darkMode = useDarkModeStore((state) => state.darkMode);

  return (
    <MapContainer center={[47.57, 16.496]} zoom={8} scrollWheelZoom={false}>
      {darkMode ? (
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}

      <Marker position={[47.57, 16.496]}>
        <Popup>
          This is a PermaplanT site. Click <a href="/sites/1">here</a> to visit.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
