import { useState } from 'react';
import { Layer, Image } from 'react-konva';
import useImage from 'use-image';

interface BaseLayerProps {
  imageUrl: string,
  pixels_per_meter: number,
  rotation: number,
}

const BaseLayer = ({ imageUrl, pixels_per_meter, rotation }: BaseLayerProps) => {
    // TODO: replace this with some global constant as soon as #303 has been decided.  
    const conva_pixels_per_meter = 10;

    const [image] = useImage(imageUrl); 

    const scale = pixels_per_meter / conva_pixels_per_meter;

    return (
        <Layer>
            <Image image={image} rotation={rotation} scaleX={scale} scaleY={scale}/>
        </Layer>
    );
};

export default BaseLayer;