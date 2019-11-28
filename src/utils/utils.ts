/**
 * Gets the current User Selection(s)
 * @returns readonly SceneNode[]
 */

export function getCurrentSelections(): readonly SceneNode[] {
    return figma.currentPage.selection;
}

/**
 * Filters nodes that have fills.
 * @param  {readonlySceneNode[]} nodes
 * @returns SceneNode
 */
export function filterNodesWithFills(nodes: readonly SceneNode[]): SceneNode[] {
    const nodeWithFills = nodes.filter(node => {
        if ("fills" in node) {
            for (const fill of (node.fills as Array<any>)) {
                return true;
            }
            return false;
        } else {
            return false
        }
    });

    return nodeWithFills.length == 0 ? [] : nodeWithFills;
}

/**
 * Checks if a object is iteratable
 * @param obj 
 */

function _isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === "function";
}

/**
 * Converts ImageBytes to ImageHash and adds to ImagePaint
 * @param  {Uint8Array} bytes  Imagebytes to convert
 * @param  {ImagePaint} paint ImagePaint to add the converted ImageHash
 * @returns ImagePaint Returns a new ImagePaint with the converted ImageHash added to it
 */
export function ImageBytesToImageFill({ imageBytes, scaleMode }): ImagePaint {
    // Create a new paint for the new image.
    return { type: 'IMAGE', imageHash: figma.createImage(imageBytes).hash, scaleMode: "FIT" };
}


// Encoding an image is also done by sticking pixels in an
// HTML canvas and by asking the canvas to serialize it into
// an actual PNG file via canvas.toBlob().
export async function encode(blob) {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(new Uint8Array(reader.result as any))
        reader.onerror = () => reject(new Error('Could not read from blob'))
        reader.readAsArrayBuffer(blob)
    })
}

// Decoding an image can be done by sticking it in an HTML
// canvas, as we can read individual pixels off the canvas.
async function decode(canvas, ctx, bytes) {
    const url = URL.createObjectURL(new Blob([bytes]))
    const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject()
        img.src = url
    }) as HTMLImageElement
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, image.width, image.height)
    return imageData
}


/**
 * Add a new image fill to the currently selected figma object
 * @param imageBytes Image to add as a new image fill
 */
export function applySnapshotToSelectedFigmaObject(imageBytes) {
    const currentSelections = getCurrentSelections();

    // Check if at least a selected 
    if (currentSelections.length == 0) {
        figma.notify('😏 Please select at least one item.');
        return;
    } else {
        const itemsFillable = filterNodesWithFills(currentSelections);
        if (itemsFillable.length == 0) {
            figma.notify('😅 Please select at least one item that can filled with image.');
            // return;
        }

        for (const item of itemsFillable) {
            const copyNodeFills = [...((item as GeometryMixin).fills as Array<ImagePaint>)];
            copyNodeFills.push(ImageBytesToImageFill({ imageBytes: imageBytes, scaleMode: "FIT" }));
            (item as GeometryMixin).fills = copyNodeFills;
        }
    }
}