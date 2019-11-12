export default function reducer(state, { type, payload = null }) {
  switch (type) {
    case "LOADING_MODEL":
      console.log("reducer called")
      return {
        ...state,
        loading: true,
        loadingText: payload
      };
    case "DONE_LOADING_MODEL":
      return {
        ...state,
        loading: false,
        loadingText: ""
      };
    case "SET_IMPORT_TYPE":
      return {
        ...state,
        importType: payload,
      };
    case "SET_IMPORT_DATA":
      return {
        ...state,
        importData: payload,
      };
    case "SET_SNAP_HANDLER":
      return {
        ...state,
        handleSnap: payload,
      };
    case "SET_ENV":
      return {
        ...state,
        env: payload,
      };
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: payload,
      };
    case "SET_SCENE_TREE":
      return {
        ...state,
        sceneTree: payload,
      };
    case "SET_SELECT_OBJECT":
      return {
        ...state,
        selectItemInTree: payload,
      };
    case "SET_SELECTED_ITEM_ID":
      return {
        ...state,
        viewportSelectedItemID: payload,
      };
    case "SET_ITEM_FOR_HIDE":
      return {
        ...state,
        hideItemValue: payload,
      };
    case "SET_ITEM_FOR_DELETE":
      return {
        ...state,
        hideItemDelete: payload,
      };
    case "SET_TRANSFORM_MODE":
      return {
        ...state,
        transformControlMode: payload,
      };
    case "SET_TRANSFORM_OBJECT_AS_PIVOT":
      return {
        ...state,
        transformControlPivot: payload,
      };
    case "ADD_LIGHT_TO_SCENE":
      const l = state.lightsInScene;
      l.push(payload)
      return {
        ...state,
        lightsInScene: l,
      };
    case "REMOVE_LIGHT_FROM_SCENE":
      const lights = state.lightsInScene;
      lights.splice(payload, 1);
      return {
        ...state,
        lightsInScene: lights,
      };
    case "UPDATE_LIGHT_OF_SCENE":
      return {
        ...state,
        updateLightData: { ...payload },
      };
    case "REQUEST_ADD_LIGHT_TO_SCENE":
      return {
        ...state,
        requestAddLight: payload,
      };
    case "SET_SHOW_GRID":
      return {
        ...state,
        showGrid: payload,
      };
    case "SET_HIDE_GROUND_ON_SNAP":
      return {
        ...state,
        hideGroundOnSnap: payload,
      };
    case "SNAP":
      return {
        ...state,
        snap: payload,
      };
    case "SET_FOG_DATA":
      return {
        ...state,
        fogData: payload
      }
  }
}