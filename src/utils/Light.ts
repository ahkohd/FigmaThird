import { number } from "prop-types"
import { Color } from "three";

export interface Light {
    id: number;
    color: Color[];
    intensity: number,
    type: string,
    helperId: number,
    distance?: number,
    width?: number,
    height?: number,
    decay?: number
}