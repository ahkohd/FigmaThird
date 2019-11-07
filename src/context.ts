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
    selectItemInTree: null
});

export default AppContext;
