import SimpleFormInput from "@/components/Form/SimpleFormInput";
import { number } from "prop-types";
import { useState } from "react";
import BaseLayer from "../layers/BaseLayer";
import { BaseStage } from "./BaseStage";

const BaseLayerConfigurator = () => {
    const [imageUrl, setImageUrl]      = useState('');
    const [rotation, setImageRotation] = useState(0);
    const [scale, setImageScale]       = useState(10);
    
    const onUrlInputChange = (value: string | number) => {
        // TODO: add error handling 
        if (typeof value === 'number') return;
        setImageUrl(value);
    }  
    
    const onRotationInputChange = (value: string | number) => {
        if (typeof value === 'string') return;
        console.log(rotation);
        setImageRotation(value);
    }
    
    const onScaleInputChange = (value: string | number) => {
        if (typeof value === 'string') return;
        console.log(rotation);
        setImageScale(value);
    }

    return (
        <div>
            <div className="flex flex-column">
                <SimpleFormInput id={"url"}
                                 labelText={"Background image URL"}
                                 onChange={onUrlInputChange}></SimpleFormInput>
                
                <SimpleFormInput id={"rotation"}
                                 labelText={"Rotation"}
                                 onChange={onRotationInputChange}
                                 type={'number'}
                                 defaultValue={0}
                                 min={0}
                                 max={359}></SimpleFormInput>
            
                <SimpleFormInput id={"scale"}
                                 labelText={"Pixels per Meter"}
                                 onChange={onScaleInputChange}
                                 defaultValue={10}
                                 type={'number'}
                                 min={1}></SimpleFormInput>
            </div>
            <BaseStage>
                <BaseLayer imageUrl={imageUrl} rotation={rotation} pixels_per_meter={scale}></BaseLayer>
            </BaseStage>
        </div>
    );
};

export default BaseLayerConfigurator;