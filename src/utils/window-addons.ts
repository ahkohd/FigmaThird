export default function setupAddons() {
    // An hack, to hold current inspector toggler...
    // see src/components/Inspector.tsx
    (window as any).THIRD_INSPECTOR_TOGGLER = null;

    // Save postMessage to a global window
    (window as any).third_alert = message => {
        parent.postMessage({ pluginMessage: { type: "alert", message } }, "*");
    };

    // apply window styles..
    if (navigator.platform.toLowerCase() == "win32") {

        // ...change scrollbar style. 
        const style = document.createElement("style");
        style.innerHTML = `
        ::-webkit-scrollbar {
          width: 8px; 
          background-color: rgba(0,0,0,0);
          -webkit-border-radius: 100px;
        }

        ::-webkit-scrollbar:hover {
          background-color: rgba(0, 0, 0, 0.09);
        }
        
        ::-webkit-scrollbar-thumb:vertical {
          -webkit-border-radius: 100px;
        }
        ::-webkit-scrollbar-thumb:vertical:active {
          background: rgba(0,0,0,0.61);
          -webkit-border-radius: 100px;
        }
        
        background: linear-gradient(45deg, white, silver);
        min-height: 100%;`;

        document.body.append(style);
    }

}