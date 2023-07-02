import { useMapId } from "@/features/map_planning/hooks/useMapId";
import useMapStore from "@/features/map_planning/store/MapStore";
import { FileSelector } from "@/features/nextcloud_integration/components/FileSelector"
import { FileStat } from "webdav";


export const PhotoLayerRightToolbar = () => {
  const mapId = useMapId();
  const path = "/PermaplanT/" + mapId + "/photo/"
  const selectImageInfo = useMapStore((state) => state.selectImageInfo);

  function onSelect(file: FileStat){
    console.log(file)
    selectImageInfo(file)
  }
  return <div>
    <FileSelector path={path} onSelect={onSelect}/>
  </div>
}
