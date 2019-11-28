export default function setupAddons() {
    // An hack, to hold current inspector toggler...
    // see src/components/Inspector.tsx
    (window as any).THIRD_INSPECTOR_TOGGLER = null;

    // Save postMessage to a global window
    (window as any).third_alert = message => {
        parent.postMessage({ pluginMessage: { type: "alert", message } }, "*");
    };

}