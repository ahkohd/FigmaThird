import {
    Color,
    HemisphereLight,
    HemisphereLightHelper,
    DirectionalLight,
    DirectionalLightHelper,
    AmbientLight,
    PointLight,
    PointLightHelper,
    SpotLight,
    Group,
    SpotLightHelper,
    CameraHelper,
    AxesHelper,
    RectAreaLight,
    Mesh,
    PlaneBufferGeometry,
    MeshBasicMaterial,
    BackSide
} from "three";
import { ILight } from "../../utils/ILight";

/**
 * Adds HemisphereLight to scene.
 * @param param0
 * @param colors
 * @param intensity
 */

export function addHemiLight({ scene, track, dispatch }, colors: Color[], intensity) {
    let light = track(new HemisphereLight(colors[0], colors[1], intensity));
    let lightHelper = track(new HemisphereLightHelper(light, 5));
    light.position.set(0, 20, 0);
    scene.add(light);
    scene.add(lightHelper);

    let out: ILight = {
        id: light.id,
        color: [light.skyColor || new Color(0xffffff), light.groundColor || new Color(0xffffff)],
        intensity: light.intensity,
        type: "HemisphereLight",
        helperId: lightHelper.id
    };

    dispatch({
        type: "ADD_LIGHT_TO_SCENE",
        payload: out
    });
}

/**
 * Adds DirectionalLight to scene.
 * @param param0
 * @param colors
 * @param intensity
 */

export function addDirLight({ scene, track, dispatch }, colors: THREE.Color[], intensity) {
    let light1 = track(new DirectionalLight(colors[0], intensity));
    light1.position.set(0, 20, -20);
    light1.castShadow = true;
    light1.shadow.camera.top = 1000;
    light1.shadow.camera.bottom = -1000;
    light1.shadow.camera.left = -1000;
    light1.shadow.camera.right = 1000;
    light1.shadow.mapSize.width = 1024 * 5;
    light1.shadow.mapSize.height = 1024 * 5;

    const light1Helper = track(new DirectionalLightHelper(light1, 5));
    scene.add(light1);
    scene.add(light1Helper);

    let out: ILight = {
        id: light1.id,
        color: [light1.color],
        intensity: light1.intensity,
        type: "DirectionalLight",
        helperId: light1Helper.id
    };

    dispatch({
        type: "ADD_LIGHT_TO_SCENE",
        payload: out
    });
}

/**
 * Adds AmbientLight to scene.
 * @param param0
 * @param colors
 * @param intensity
 */

export function addAmbLight({ scene, track, dispatch }, colors: THREE.Color[], intensity) {
    let light1 = track(new AmbientLight(colors[0], intensity));
    light1.position.set(0, 0, 0);
    scene.add(light1);

    let out: ILight = {
        id: light1.id,
        color: [light1.color],
        intensity: light1.intensity,
        type: "AmbientLight"
    };

    dispatch({
        type: "ADD_LIGHT_TO_SCENE",
        payload: out
    });
}

/**
 * Adds PointLight to scene.
 */

export function addPointLight(
    { scene, track, dispatch },
    colors: THREE.Color[],
    intensity,
    distance
) {
    let light1 = track(new PointLight(colors[0], intensity, distance));
    light1.position.set(0, 50, 0);
    light1.castShadow = true;
    light1.decay = 1;
    const light1Helper = track(new PointLightHelper(light1, 5));
    scene.add(light1);
    scene.add(light1Helper);

    let out: ILight = {
        id: light1.id,
        color: [light1.color],
        intensity: light1.intensity,
        type: "PointLight",
        helperId: light1Helper.id,
        distance,
        decay: 1
    };

    dispatch({
        type: "ADD_LIGHT_TO_SCENE",
        payload: out
    });
}

/**
 * Adds SpotLight to scene.
 * @param param0
 * @param colors
 * @param intensity
 */

export function addSpotLight({ scene, track, dispatch }, colors: THREE.Color[], intensity) {
    let light1 = track(new SpotLight(colors[0], intensity));
    light1.position.set(0, 80, 0);
    light1.angle = Math.PI / 3;
    light1.penumbra = 1;
    light1.decay = 1;
    light1.distance = 200;
    light1.castShadow = true;
    light1.shadow.mapSize.width = 1024 * 5;
    light1.shadow.mapSize.height = 1024 * 5;
    const spotLightHelpers = track(new Group());
    spotLightHelpers.name = "Spot Light Helpers";

    const light1Helper = track(new SpotLightHelper(light1));
    spotLightHelpers.add(light1Helper);
    const shadowCameraHelper = track(new CameraHelper(light1.shadow.camera));
    spotLightHelpers.add(shadowCameraHelper);
    spotLightHelpers.add(track(new AxesHelper(10)));
    light1.add(spotLightHelpers);

    scene.add(light1);

    let out: ILight = {
        id: light1.id,
        color: colors,
        intensity: intensity,
        type: "SpotLight",
        angle: Math.PI / 3,
        decay: 2,
        penumbra: 0.05,
        distance: 10,
        helperId: spotLightHelpers.id
    };

    dispatch({
        type: "ADD_LIGHT_TO_SCENE",
        payload: out
    });
}

/**
 * Adds RectAreaLight to scene.
 * @param param0
 * @param colors
 * @param intensity
 * @param width
 * @param height
 */

export function addRectLight(
    { scene, track, dispatch },
    colors: Color[],
    intensity: number,
    width: number,
    height: number
) {
    let lightGroup = track(new Group());
    lightGroup.name = "RectAreaLightControl";

    let rectLight = new RectAreaLight(colors[0], intensity, width, height);
    rectLight.position.set(0, 20, 0);
    rectLight.lookAt(0, 0, 0);

    let rectLightMesh = track(
        new Mesh(
            new PlaneBufferGeometry(),
            new MeshBasicMaterial({
                side: BackSide
            })
        )
    );
    rectLightMesh.scale.x = rectLight.width;
    rectLightMesh.scale.y = rectLight.height;

    rectLight.color.setRGB(colors[0].r, colors[0].g, colors[0].b);
    (rectLightMesh.material as any).color.copy(rectLight.color).multiplyScalar(rectLight.intensity);

    let rectLightMeshBack = track(
        new Mesh(new PlaneBufferGeometry(), new MeshBasicMaterial({ color: 0x080808 }))
    );

    rectLight.add(rectLightMesh);
    rectLightMesh.add(rectLightMeshBack);

    lightGroup.add(rectLight);
    scene.add(lightGroup);

    let out: ILight = {
        id: lightGroup.id,
        color: [colors[0]],
        intensity: intensity,
        type: "RectAreaLight",
        width,
        height,
        helperId: rectLight.id,
        lightMeshId: rectLightMesh.id,
        lightBackMeshId: rectLightMeshBack.id
    };

    dispatch({
        type: "ADD_LIGHT_TO_SCENE",
        payload: out
    });
}
