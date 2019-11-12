// App store
import { createContext } from 'react';

const AppContext = createContext({
    loading: false,
    loadingText: "",
    importType: "obj",
    importData: null,
    handleSnap: null,
    activeTab: 'import',
    sceneTree: {
        name: "root",
        toggled: true,
        children: []
    },
    selectItemInTree: null,
    viewportSelectedItemID: null,
    hideItemDelete: null,
    hideItemValue: null,
    transformControlPivot: null,
    lightsInScene: [],
    updateLightData: null,
    requestAddLight: null,
    showGrid: true,
    fogData: {
        visible: false,
        far: 600,
        near: 10,
        color: { r: 255, g: 255, b: 255 }
    },
    hideGroundOnSnap: { value: true, _t: new Date().getMilliseconds() },
    snap: null

});

export default AppContext;
