import { useDarkModeStore } from '@/features/dark_mode';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const GeoMap = () => {
  const darkMode = useDarkModeStore((state) => state.darkMode);

  const locations: Array<LatLngExpression> = [
    [47.57, 16.496],
    [48.220778, 16.3100205],
    [45.9666245, 14.4132204],
    [48.1069151, 14.6971373],
    [44.0601985, 10.4295918],
    [46.6665335, 11.5916032],
    [47.5835126, 12.1893057],
  ];
  const markers = locations.map((location, index) => {
    return (
      <Marker key={'marker-' + index} position={location}>
        <Popup>
          This is a PermaplanT site. Click <a href={`/sites/${index}`}>here</a> to visit.
        </Popup>
      </Marker>
    );
  });

  return (
    <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={false}>
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
      {markers}
    </MapContainer>
  );
};
