import { Color } from "three";

/**
 * @interface ILight contains subset properties of [Three.JS Light](https://threejs.org/docs/index.html#api/en/lights/Light)
 */

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
    index?: number,
    angle?: number,
    penumbra?: number
}