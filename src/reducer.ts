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
    default:
      return state;
  }
}