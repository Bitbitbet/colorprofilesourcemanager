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

const output_name = "eDP-1";

ICCDisabled = false;
const whiteListKey = Symbol('Window is in whitelist');

function toggleICC(disable) {
    if (disable == ICCDisabled) return;
    ICCDisabled = disable;
    const profile = disable ? "sRGB" : "ICC";
    callDBus("nl.dvdgiessen.dbusapplauncher", "/nl/dvdgiessen/DBusAppLauncher", "nl.dvdgiessen.dbusapplauncher.Exec", "Cmd",
        "kscreen-doctor output." + output_name + ".colorProfileSource." + profile);
}

function isWindowInWhiteList(window) {
    return WhiteList.some(({ caption, resourceClass }) =>
        (caption === null || regex.test(window.caption)) &&
        (resourceClass === null || resourceClass.test(window.resourceClass)))
}

workspace.windowActivated.connect(window => {
    if (!window) return;
    if (window[whiteListKey] === undefined) {
        if (isWindowInWhiteList(window)) {
            // console.log("Look at the shiny new window I've found:\n" + window.caption + ", " + window.resourceClass);
            window[whiteListKey] = true;

            /* Use to trigger profile change when the active window isn't changed but the fullscreen is toggled */
            window.fullScreenChanged.connect(() => {
                if (window.active) {
                    toggleICC(window.fullScreen);
                }
            });
        } else {
            // console.log("Ehh, what a boring window I've found:\n" + window.caption + ", " + window.resourceClass);
            window[whiteListKey] = false;
        }
    }
    /* Disable icc profile when the window is in white list and in fullscreen */
    toggleICC(window[whiteListKey] && window.fullScreen);
});
