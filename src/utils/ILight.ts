import { Color } from "three";

export interface ILight {
    id: number;
    color: Color[];
    intensity: number,
    type: string,
    helperId?: number,
    distance?: number,
    width?: number,
    height?: number,
    decay?: number,
    lightMeshId?: number,
    lightBackMeshId?: number,
    index?: number
}