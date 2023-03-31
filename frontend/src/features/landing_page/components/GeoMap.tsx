import 'leaflet/dist/leaflet.css';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const GeoMap = () => (
  <div className="my-24 w-full min-w-[32rem] ">
    <h1 className="title-font mb-12 text-center text-3xl font-medium">
      Discover the PermaplanT world
    </h1>
    <div className="h-[50vh] min-h-[24rem] grow rounded border-neutral-400 bg-neutral-100 dark:border-neutral-300-dark dark:bg-neutral-200-dark">
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
    </div>
  </div>
);
