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
    hideItemValue: null

});

export default AppContext;
