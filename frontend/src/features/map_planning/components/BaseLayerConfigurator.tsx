import SimpleButton from "@/components/Button/SimpleButton";
import SimpleFormInput from "@/components/Form/SimpleFormInput";
import ModalContainer from "@/components/Modals/ModalContainer";
import { returnStatement } from "@babel/types";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Layer, Line } from "react-konva";
import BaseLayer from "../layers/BaseLayer";
import { BaseStage } from "./BaseStage";

enum MeasurementState {
    Initial,
    OnePointSelected,
    TwoPointsSelected,
};

const BaseLayerConfigurator = () => {
    const [imageUrl, setImageUrl]      = useState('');
    const [rotation, setImageRotation] = useState(0);
    const [scale, setImageScale]       = useState(10);
    const [realWorldLength, setRealWorldLength] = useState(0);
    
    const onUrlInputChange = (value: string | number) => {
        // TODO: add error handling 
        if (typeof value === 'number') return;
        setImageUrl(value);
    }  
    
    const onRotationInputChange = (value: string | number) => {
        if (typeof value === 'string') return;
        setImageRotation(value);
    }
    
    const onScaleInputChange = (value: string | number) => {
        if (typeof value === 'string') return;
        setImageScale(value);
    }

    const onDistanceInputChange = (value: string | number) => {
        if (typeof value === 'string') return;
        setRealWorldLength(value);
    }

    // Determine the scale of the image using the length of a known distance
    const [measureState, setMeasureState]           = useState(MeasurementState.Initial);
    const [measureLinePoints, setMeasureLinePoints] = useState<number[]>([]);
    const [measuredLength, setMeasuredLengh]        = useState(0);

    const [showDistanceInputModal, setShowDistanceInputModal] = useState(false);

    const onBaseStageClick = (e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.button !== 0) return;
        
        switch (measureState) {
            case MeasurementState.Initial:
                const x =  e.target.getStage()?.getRelativePointerPosition()?.x == null ? 0 : e.target.getStage()?.getRelativePointerPosition()?.x;
                const y =  e.target.getStage()?.getRelativePointerPosition()?.y == null ? 0 : e.target.getStage()?.getRelativePointerPosition()?.y;
                
                setMeasureLinePoints([x ?? 0, y ?? 0]);
                setMeasureState(MeasurementState.OnePointSelected);
                break;
            
            case MeasurementState.OnePointSelected:
                const lineLengthX = Math.abs(measureLinePoints[2] - measureLinePoints[0]);
                const lineLengthY = Math.abs(measureLinePoints[3] - measureLinePoints[1]);

                // use the pythagorean theorem to get the measured length
                const lineLength  = Math.sqrt(lineLengthX * lineLengthX + lineLengthY * lineLengthY);

                setMeasuredLengh(lineLength);
                
                // Promt the user to input the real world length of the measured distance
                setShowDistanceInputModal(true);

                setMeasureState(MeasurementState.TwoPointsSelected);
                break;

            case MeasurementState.TwoPointsSelected:
                setMeasureLinePoints([]);
                setMeasureState(MeasurementState.Initial);
                break;

        }
    }

    const onBaseStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (measureState !== MeasurementState.OnePointSelected) return;

        const x =  e.target.getStage()?.getRelativePointerPosition()?.x == null ? 0 : e.target.getStage()?.getRelativePointerPosition()?.x;
        const y =  e.target.getStage()?.getRelativePointerPosition()?.y == null ? 0 : e.target.getStage()?.getRelativePointerPosition()?.y;

        setMeasureLinePoints([measureLinePoints[0], measureLinePoints[1], x ?? 0, y ?? 0]);
    }
   
    const onDistanceInputModalSubmit = () => {
        // TODO: replace 10 with a global constant
        setImageScale(measuredLength / realWorldLength); 
        setShowDistanceInputModal(false);
        
        setMeasureState(MeasurementState.Initial);
    } 
   
    const onDistanceInputModalCancel = () => {
        setMeasureLinePoints([]);
        setMeasureState(MeasurementState.Initial);
        setShowDistanceInputModal(false);
    } 
    
    return (
        <div className="pb-1">
            <ModalContainer show={showDistanceInputModal}>
                <div className="flex min-h-[200px] w-[400px] flex-col justify-between rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
                    <SimpleFormInput id={"distance-input"}
                                    labelText={"Length of the selected distance in Meters"}
                                    type={"number"}
                                    min={0}
                                    onChange={onDistanceInputChange} 
                    />
                    <div className="space-between flex flex-row justify-center space-x-8">
                        <SimpleButton onClick={onDistanceInputModalCancel} className="max-w-[240px] grow">
                            Cancel
                        </SimpleButton>
                        <SimpleButton onClick={onDistanceInputModalSubmit} className="max-w-[240px] grow">
                            Submit 
                        </SimpleButton>
                
                    </div>
                </div>
            </ModalContainer>

            <div className="flex flex-column gap-4">
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
                                 value={scale.toString()}
                                 type={'number'}
                                 min={1}></SimpleFormInput>
            </div>
            <div className="left-0 absolute mt-2">
                <BaseStage
                    onMouseMove={onBaseStageMouseMove}
                    onClick={onBaseStageClick}>
                    <BaseLayer imageUrl={imageUrl} rotation={rotation} pixels_per_meter={scale}></BaseLayer>
                    <Layer>
                        <Line
                            points={measureLinePoints}
                            stroke={"#ff0000"}
                            lineWidth={10}
                            lineCap="square"  
                        />
                    </Layer>
                </BaseStage>
            </div>
        </div>
    );
};

export default BaseLayerConfigurator;