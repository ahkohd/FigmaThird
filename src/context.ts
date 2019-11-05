// App store
import { createContext } from 'react';

const AppContext = createContext({
    loading: false,
    loadingText: "",
    importType: "obj",
    importData: null,
    handleSnap: null
});

export default AppContext;
