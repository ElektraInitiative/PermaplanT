import { LatLngExpression, Icon } from 'leaflet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useDarkModeStore } from '@/features/dark_mode';
import { PublicNextcloudImage } from '@/features/nextcloud_integration/components/PublicNextcloudImage';
import 'leaflet/dist/leaflet.css';

const locations: Array<LatLngExpression> = [
  [47.57, 16.496],
  [48.220778, 16.3100205],
  [45.9666245, 14.4132204],
  [48.1069151, 14.6971373],
  [44.0601985, 10.4295918],
  [46.6665335, 11.5916032],
  [47.5835126, 12.1893057],
];

export const GeoMap = () => {
  const [isVisible, setIsVisible] = useState(false);
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const { t } = useTranslation(['geomap']);
  const myIcon = new Icon({
    iconUrl: '/plant.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, 0],
  });
  const markers = locations.map((location, index) => {
    return (
      <Marker key={'marker-' + index} position={location} icon={myIcon}>
        <Popup>
          This is a PermaplanT site. Click <a href={`/sites/${index}`}>here</a> to visit.
        </Popup>
      </Marker>
    );
  });
  const map = (
    <MapContainer center={[47.57, 16.496]} zoom={7} scrollWheelZoom={false}>
      {darkMode ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
  const placeholder = (
    <div className="flex h-full w-full flex-col text-center" id="placeholder">
      <PublicNextcloudImage
        path="Maps/permaplant-map-placeholder.png"
        shareToken="2arzyJZYj2oNnHX"
        alt="PermaplanT Map"
        className="h-full w-full object-cover hover:cursor-pointer"
        onClick={() => setIsVisible(true)}
      />
      <span className="my-2 flex-1 shrink-0 grow text-sm italic">{t('geomap:hint')}</span>
    </div>
  );

  if (isVisible) {
    return map;
  }

  return placeholder;
};
