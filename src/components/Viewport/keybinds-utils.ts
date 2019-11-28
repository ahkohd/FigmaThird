import * as THREE from "three";

export function handleUserKeyDownInput({ transformControl }, event) {
    switch (event.keyCode) {
        case 81: // Q
            transformControl.setSpace(transformControl.space === "local" ? "world" : "local");
            break;

        case 17: // Ctrl
            transformControl.setTranslationSnap(100);
            transformControl.setRotationSnap(THREE.Math.degToRad(15));
            break;

        case 87: // W
            transformControl.setMode("translate");
            break;

        case 69: // E
            transformControl.setMode("rotate");
            break;

        case 82: // R
            transformControl.setMode("scale");
            break;

        case 187:
        case 107: // +, =, num+
            transformControl.setSize(transformControl.size + 0.1);
            break;

        case 189:
        case 109: // -, _, num-
            transformControl.setSize(Math.max(transformControl.size - 0.1, 0.1));
            break;

        case 88: // X
            transformControl.showX = !transformControl.showX;
            break;

        case 89: // Y
            transformControl.showY = !transformControl.showY;
            break;

        case 90: // Z
            transformControl.showZ = !transformControl.showZ;
            break;

        case 32: // Spacebar
            transformControl.enabled = !transformControl.enabled;
            break;
    }
}

export function handleUserKeyUpInput({ transformControl }, event) {
    switch (event.keyCode) {
        case 17: // Ctrl
            transformControl.setTranslationSnap(null);
            transformControl.setRotationSnap(null);
            break;
    }
}

export function onMouseDown({ getMousePosition, port, onDownPosition, onMouseUp }, event) {
    event.preventDefault();
    const array = getMousePosition(port, event.clientX, event.clientY);
    onDownPosition.fromArray(array);
    console.log(1, "DOWN_POS", onDownPosition);
    document.addEventListener("mouseup", onMouseUp, false);
}

export function onDoubleClick(
    {
        getMousePosition,
        onDoubleClickPosition,
        port,
        getAllObjects,
        getIntersects,
        setObjectAsPivotPoint
    },
    event
) {
    const array = getMousePosition(port, event.clientX, event.clientY);
    onDoubleClickPosition.fromArray(array);

    const intersects = getIntersects(onDoubleClickPosition, getAllObjects());

    if (intersects.length > 0) {
        const intersect = intersects[0];

        setObjectAsPivotPoint(intersect.object);
    }
}

/**
 * Set up both keyboard and mouse event listeners for transform control.
 * @param param0
 */
export function setupKeyAndMouseEventListeners({
    transformControl,
    getMousePosition,
    port,
    onDownPosition,
    onMouseUp,
    onDoubleClickPosition,
    getAllObjects,
    getIntersects,
    setObjectAsPivotPoint
}) {
    window.addEventListener("keydown", event =>
        handleUserKeyDownInput({ transformControl }, event)
    );

    window.addEventListener("keyup", event => handleUserKeyUpInput({ transformControl }, event));

    // object selection listners
    port.addEventListener(
        "mousedown",
        event => {
            onMouseDown({ getMousePosition, port, onDownPosition, onMouseUp }, event);
        },
        false
    );

    port.addEventListener(
        "dblclick",
        event =>
            onDoubleClick(
                {
                    getMousePosition,
                    onDoubleClickPosition,
                    port,
                    getAllObjects,
                    getIntersects,
                    setObjectAsPivotPoint
                },
                event
            ),
        false
    );
}

/**
 * Clean up both keyboard and mouse event listeners of transform control.
 * @param param0
 */
export function cleanupKeyAndMouseEventListeners({
    transformControl,
    getMousePosition,
    port,
    onDownPosition,
    onMouseDown,
    onMouseUp
}) {
    window.removeEventListener("keydown", event =>
        handleUserKeyDownInput({ transformControl }, event)
    );
    window.removeEventListener("keyup", event => handleUserKeyUpInput({ transformControl }, event));
    port.removeEventListener(
        "mousedown",
        event => onMouseDown({ getMousePosition, port, onDownPosition, onMouseUp }, event),
        false
    );
}
