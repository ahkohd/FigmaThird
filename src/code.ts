import { applySnapshotToSelectedFigmaObject } from "./utils/utils";

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 800,
  height: 450
});

// Calls to "parent.postMessage" from within the HTML page will trigger this

figma.ui.onmessage = msg => {
  // Distinguishing between different types of messages sent from the UI

  if (msg.type === "applySnapshot") {
    applySnapshotToSelectedFigmaObject(msg.imageData)
    return;
  }

  if (msg.type === "alert") {
    figma.notify(msg.message)
    return;
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
