import {NewBaseLayerDto} from "../../../bindings/definitions";
import axios from "axios";
import {baseApiUrl} from "../../../config";

export const createBaseLayer = async (baseLayer: NewBaseLayerDto) => {
    try {
        await axios.post<NewBaseLayerDto>(`${baseApiUrl}/api/base_layers`, baseLayer);
    } catch (error) {
        throw error as Error;
    }
}