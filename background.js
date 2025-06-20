import Analytics from "./scripts/google-analytics.js"

addEventListener("unhandledrejection", async (event) => {
    Analytics.fireErrorEvent(event.reason)
})

chrome.runtime.onInstalled.addListener(() => {
    reRegisterContextMenu()
    Analytics.fireEvent("install")
    console.log("New install detected!")
})

chrome.runtime.onStartup.addListener(() => {
    reRegisterContextMenu()
    chrome.storage.local.get("autoCheckIn", (data) => {
        if (data.autoCheckIn) {
            console.log("Auto check in...")
            autoCheckIn()
        } else {
            console.log("Auto check in off.")
        }
    })
})

function reRegisterContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            title: chrome.i18n.getMessage("contextMenuRedeem"),
            id: "redeem",
            contexts: ["selection"]
        })
    })

    chrome.contextMenus.onClicked.addListener((data) => {
        if (data.menuItemId == "redeem") {
            let code = data.selectionText.replace(/\s+/g, '')
            console.log(code)
            const url = chrome.i18n.getMessage("redeemUrl") + encodeURIComponent(code)
            console.log("Opening new tab ", url)
            chrome.tabs.create({url});
        }
    })
}


/**
 * Auto check in
 */
function autoCheckIn() {
    getCheckInStatus().then((result) => {
        if (result.checkInData.retcode == 0) {
            // Check in status load success.
            if (result.checkInData.data.is_sign) {
                // Check in already done.
               console.log("Check-in already done.")
            } else {
                // Have to check in.
                checkInRequest().then((result) => {
                    // Check in success.
                    if (result.retcode == 0) {
                        console.log("Check in success. ", result)
                        chrome.notifications.create({
                            type: "basic",
                            title: chrome.i18n.getMessage("notifCheckInDoneTitle"),
                            message: chrome.i18n.getMessage("notifCheckInDoneMessage"),
                            iconUrl: "./icons/icon128.png"
                        })
                        Analytics.fireEvent("auto_checkin")
                    } else {
                        // Hoyoverse error while checking in
                        console.error("Hoyoverse error while requesting check in. E: ", result.message)
                        chrome.notifications.create({
                            type: "basic", 
                            title: chrome.i18n.getMessage("notifCheckInStatusLoadFailTitle"),
                            message: chrome.i18n.getMessage("notifCheckInStatusLoadFailMessage") + result.message,
                            iconUrl: "./icons/icon128.png"
                        })
                        Analytics.fireErrorEvent("auto_checkin_error", {e: null, hyvResponse: result})
                    }
                }).catch((e) => {
                    console.error("Error while requesting check in to hoyoverse. E: ", e)
                    chrome.notifications.create({
                        type: "basic",
                        title: chrome.i18n.getMessage("notifCheckInStatusLoadFailTitle"),
                        message: chrome.i18n.getMessage("notifCheckInStatusLoadFailMessage") + e.message,
                        iconUrl: "./icons/icon128.png"
                    })
                    Analytics.fireErrorEvent("auto_checkin_error", {e, hyvResponse: null})
                })
            }
        } else if (result.checkInData.retcode == -100) {
            // Not logged in.
            console.warn("Not logged in to hoyolab: ", result)
            chrome.notifications.create({
                type: "basic",
                title: chrome.i18n.getMessage("notifCheckInNotLoginTitle"),
                message: chrome.i18n.getMessage("notifCheckInNotLoginMessage"),
                iconUrl: "./icons/icon128.png"
            })
        } else {
            // Attempted to query hoyoverse for check in status, but rejected.
            console.error("Check in status query reject from hoyoverse: ", result)
            chrome.notifications.create({
                type: "basic",
                title: chrome.i18n.getMessage("notifCheckInStatusLoadFailTitle"),
                message: chrome.i18n.getMessage("notifCheckInStatusLoadFailMessage") + result.checkInData.message,
                iconUrl: "./icons/icon128.png"
            })
            Analytics.fireErrorEvent("auto_checkin_error", {e: null, hyvResponse: result})
        }
    }).catch((e) => {
        // Can't send HTTP request to hoyolab.
        console.error("Check in status load fail: ", e)
        chrome.notifications.create({
            type: "basic",
            title: chrome.i18n.getMessage("notifCheckInStatusLoadFailTitle"),
            message: chrome.i18n.getMessage("notifCheckInStatusLoadFailMessage") + e.message,
            iconUrl: "./icons/icon128.png"
        })
        Analytics.fireErrorEvent("auto_checkin_error", {e, hyvResponse: null})
    })
}


/**
 * Query check in status from hoyoverse.
 */
async function getCheckInStatus() {
    const checkInResponse = await fetch("https://sg-hk4e-api.hoyolab.com/event/sol/info?act_id=e202102251931481", { method: "GET" });
    const checkInData = await checkInResponse.json();
    const reCheckInResponse = await fetch("https://sg-hk4e-api.hoyolab.com/event/sol/resign_info?act_id=e202102251931481", { method: "GET" });
    const reCheckInData = await reCheckInResponse.json();
    return {checkInData, reCheckInData}
}  

/**
 * Request check in to hoyoverse.
 */
async function checkInRequest() {
    const checkInResponse = await fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", { method: "POST", body: JSON.stringify({"act_id": "e202102251931481"})});
    const checkInData = await checkInResponse.json();
    return (checkInData)
}