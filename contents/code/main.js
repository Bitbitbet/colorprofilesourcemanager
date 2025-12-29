const WhiteList = [
    {
        caption: null,
        resourceClass: /^Minecraft/
    },
    {
        caption: null,
        resourceClass: /^steam_app_/
    }
]

ICCDisabled = false;
const allowedKey = Symbol('Window is allowed')

function toggleICC(disable) {
    if (disable == ICCDisabled) return;
    ICCDisabled = disable;
    const profile = disable ? "sRGB" : "ICC";
    callDBus("nl.dvdgiessen.dbusapplauncher", "/nl/dvdgiessen/DBusAppLauncher", "nl.dvdgiessen.dbusapplauncher.Exec", "Cmd",
        "kscreen-doctor output.eDP-1.colorProfileSource." + profile);
}

function isWindowInWhiteList(window) {
    return WhiteList.some(({ caption, resourceClass }) =>
        (caption === null || regex.test(window.caption)) &&
        (resourceClass === null || resourceClass.test(window.resourceClass)))
}

workspace.windowActivated.connect(window => {
    if (!window) return;

    if (window[allowedKey] === true) {
        if (window.fullScreen) {
            toggleICC(true);
        } else {
            toggleICC(false);
        }
    } else if (window[allowedKey] === false) {
        toggleICC(false);
    } else {
        if (isWindowInWhiteList(window)) {
            // console.log("Look at the shiny new window I've found:\n" + window.caption + ", " + window.resourceClass);
            window[allowedKey] = true;

            window.fullScreenChanged.connect(() => {
                if (window.fullScreen && window.active) {
                    toggleICC(true);
                }
            });
            if (window.fullScreen) {
                toggleICC(true);
            } else {
                toggleICC(false);
            }
        } else {
            // console.log("Look at the boring window I've found:\n" + window.caption + ", " + window.resourceClass);
            window[allowedKey] = false;
            toggleICC(false);
        }
    }
});