import { MAP_PIXELS_PER_METER } from '../utils/Constants';
import { Layer, Image } from 'react-konva';
import useImage from "use-image";

interface BaseLayerProps {
  opacity: number;
  visible: boolean;
  imageURL: string;
  pixels_per_meter: number;
  rotation: number;
}

const BaseLayer = ({ visible, opacity, imageURL, pixels_per_meter, rotation }: BaseLayerProps) => {
  const [image] = useImage(imageURL);
  const scale = pixels_per_meter / MAP_PIXELS_PER_METER;
  const width = image?.width ?? 0;
  const height = image?.height ?? 0;

  return (
    <Layer listening={false} visible={visible} opacity={opacity} offset={{ x: -width, y: -height }}>
      <Image
        image={image}
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        offset={{ x: width / 2, y: height / 2 }}
      />
    </Layer>
  );
};

export default BaseLayer;
