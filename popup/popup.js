import Analytics from '../scripts/google-analytics.js'

init();

let accounts = []

async function init() {
    loadLocale()
    $(document).ready(function() {
        $('.tabs').tabs()
    })
    await showLiveDisplay()
    getCheckInStatusAndDisplay()
    displayVersion()
    console.log("Load done.")
}

// Page load event - will send data to analytics when extension opens.
window.addEventListener('load', () => {
    Analytics.firePageViewEvent(document.title, document.location.href)
    console.log("ANALYTICS: Sent to analytics that the page loaded.")
})

// Load language data
function loadLocale() {
    $("html").attr("lang", chrome.i18n.getUILanguage())
    $("#title").text(chrome.i18n.getMessage("extName"))
    $("#resin-state").text(chrome.i18n.getMessage("popupResinState"))
    $("#redeem-code").text(chrome.i18n.getMessage("popupRedeemCode"))
    $("#redeem-code-input-title").text(chrome.i18n.getMessage("popupRedeemCodeInputBoxTitle"))
    $("#redeem-code-input").attr("placeholder", chrome.i18n.getMessage("popupRedeemCodeInputBoxPlaceholder"))
    $("#redeem-btn").text(chrome.i18n.getMessage("popupRedeemCodeRedeemButton"))
    $("#copy-account-btn").text(chrome.i18n.getMessage("popupFetchAccountFromHoyolabBtn"))
    $("#auto-checkin").text(chrome.i18n.getMessage("popupCheckIn"))
    $("#option-btn").text(chrome.i18n.getMessage("popupOptionBtn"))
    $("#dev-sign-blockquote").html(`${chrome.i18n.getMessage("popupDevSignature")} / <a href="${chrome.i18n.getMessage("projectUrl")}" target="_blank">${chrome.i18n.getMessage("popupProjectLink")}</a>`)
    $("#about-title").text(chrome.i18n.getMessage("extName"))
    $("#about-desc").text(chrome.i18n.getMessage("extDesc"))
    $("#about-update-btn").text(chrome.i18n.getMessage("popupVersionUpdateBtn"))
    $("#about-update-btn").attr("href", chrome.i18n.getMessage("updateGuideUrl"))
    $("#live-state-tab-content").html(`<p>${chrome.i18n.getMessage("pleaseWait")}<p>`)
}

// Load redeem page when redeem button is clicked.
$("#redeem-btn").on("click", function() {
    let code = $("#redeem-code-input").val();
    /** Testing
    chrome.storage.local.get("redeemUsingAPI", (data) => {
        if (data.redeemUsingAPI) {
            fetch()
        } else {
        }
    })*/
    const url = chrome.i18n.getMessage("redeemUrl") + encodeURIComponent(code)
    console.log("Opening new tab ", url)
    chrome.tabs.create({url});
})

// Launch options page when clicked
$("#option-btn").on("click", function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage()
    } else {
        window.open(chrome.runtime.getURL('options/options.html'))
    }
})

// Query check in status and display
function getCheckInStatusAndDisplay() {
    $("#auto-checkin-status").text("")
    // Get auto check in status
    chrome.storage.local.get("autoCheckIn", (data) => {
        if (data.autoCheckIn) {
            // On
            $("#auto-checkin-status").append(chrome.i18n.getMessage("popupAutoCheckInOn"))
        } else {
            // Off
            $("#auto-checkin-status").append(chrome.i18n.getMessage("popupAutoCheckInOff"))
        }
        $("#auto-checkin-status").append(" ")
    })

    // Get check in status
    getCheckInStatus().then((result) => {
        if (result.checkInData.retcode == 0) {
            if (result.checkInData.data.is_sign) {
                $("#auto-checkin-status").append(chrome.i18n.getMessage("popupCheckInDone"))
            } else {
                $("#auto-checkin-status").append(chrome.i18n.getMessage("popupCheckInNotDone"))
            }
        } else {
            $("#auto-checkin-status").append(chrome.i18n.getMessage("popupCheckInLoadFail") + result.checkInData.message)
        }
    }).catch((e) => {
        $("#auto-checkin-status").append(chrome.i18n.getMessage("popupCheckInLoadFail") + e.message)
    })
}

// Initialize live display
async function showLiveDisplay() {
    try {
        let data = await getAccounts()
        if (data.retcode == 0) {
            accounts = data.data.list
            $("#live-state-tab-content").html(`
                <div class="input-field col s12">
                    <select id="account-select"></select>
                    <label for="account-select">Account</label>
                </div>
                <div id="live-state-display-box"></div>`)
            renderAccountSelect()
            renderAccountLiveState(parseInt($("#account-select").val()))
            console.log("Displayed resin.")
        } else if (data.retcode == -100) {
            accounts = []
            $("#live-state-tab-content").html(`<p>${chrome.i18n.getMessage("popupLiveStateNotLoggedIn")}</p>`)
        } else {
            accounts = []
            $("#live-state-tab-content").html(`<p>${chrome.i18n.getMessage("popupLiveStateLoadError")} ${data.message}</p>`)
        }
    } catch (e) {
        $("#live-state-tab-content").html(`<p>${chrome.i18n.getMessage("popupLiveStateLoadError")} ${e.message}</p>`)
        console.error("Error while displaying resin: ", e)
    }
    $('select').formSelect()
}

// Make list of account select menu
function renderAccountSelect() {
    $("#account-select").html("")
    accounts.forEach((element, index) => {
        console.log(`<option value="${index}">${element.region_name} / ${element.nickname}</option>`)
        $("#account-select").append(`<option value="${index}">${element.region_name} / ${element.nickname}</option>`)
    })

    // When other account is selected on account list, load it.
    $("#account-select").on("change", (e) => {
        console.log("Load new data for: ", e, $("#account-select").val())
        renderAccountLiveState(parseInt($("#account-select").val()))
    })
}

async function renderAccountLiveState(num) {
    $("#live-state-display-box").html(`<p>${chrome.i18n.getMessage("pleaseWait")}</p>`)
    try {
        let account = accounts[num]
        let liveData = await getLiveData(account.game_uid, account.region)
        if (liveData.retcode == 0) {
            console.log(liveData.data)
            $("#live-state-display-box").html(`
                <h5 id="resin-state">${chrome.i18n.getMessage("popupResinState")}</h5>
                <div id="resin-display-box">
                    <div class="indicater-container">
                        <div class="progress indicater">
                            <div class="determinate" style="width: ${Math.round(liveData.data.current_resin / liveData.data.max_resin * 100)}%;"></div>
                        </div>
                        <p style="margin: 0 5px;" class="flow-text">${liveData.data.current_resin}/${liveData.data.max_resin}</p>
                    </div>
                </div>
                <h5 id="home-state">${chrome.i18n.getMessage("popupHomeState")}</h5>
                <div id="home-state-display-box">
                    <div class="indicater-container">
                        <div class="progress indicater">
                            <div class="determinate" style="width: ${Math.round(liveData.data.current_home_coin / liveData.data.max_home_coin * 100)}%;"></div>
                        </div>
                        <p style="margin: 0 5px;" class="flow-text">${liveData.data.current_home_coin}/${liveData.data.max_home_coin}</p>
                    </div>
                </div>
                <h5 id="transformer-state">${chrome.i18n.getMessage("popupTransformerState")}</h5>
                
            `)
            if (liveData.data.transformer.obtained) {
                $("#live-state-display-box").append(`
                    <div id="transformer-state-display-box">
                        <div class="indicater-container">
                            <div class="progress indicater">
                                <div class="determinate" style="width: ${Math.round(liveData.data.transformer.recovery_time.Day / 7 * 100)}%;"></div>
                            </div>
                            <p style="margin: 0 5px;" class="flow-text">${liveData.data.transformer.recovery_time.Day}${chrome.i18n.getMessage("popupTransformerStateUnit")}</p>
                        </div>
                    </div>`)
            } else {
                $("#live-state-display-box").append(`<p>${chrome.i18n.getMessage("popupNoTransformer")}</p>`)
            }
        } else {
            // HYV Err
            $("#live-state-display-box").html(`<p>HYV Error! ${liveData.message}</p>`)
        }
    } catch (error) {
        console.error("Error while loading data: ", error)
        // Http err
        $("#live-state-display-box").html(`<p>Load error: ${error}</p>`)
    }
}

/**
 * Get account from hoyolab.
 */
async function getAccounts() {
    const response = await fetch("https://api-account-os.hoyolab.com/binding/api/getUserGameRolesByLtoken?game_biz=hk4e_global")
    const data = response.json()
    return data
}

/**
 * Get resin data from hoyolab.
 */
async function getLiveData(uid, server) {
    const response = await fetch(`https://bbs-api-os.hoyolab.com/game_record/genshin/api/dailyNote?role_id=${uid}&server=${server}`)
    const data  = response.json()
    return data
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
 * Display version in about tab
 */
async function displayVersion() {
    let versionString;
    try {
        const url = "https://raw.githubusercontent.com/jwdjk392/genshin-helper/refs/heads/main/latest"
        const updateData = await fetch(url)
        if (updateData.ok) {
            const version = await updateData.text()
            versionString = chrome.i18n.getMessage("popupVersionLatest") + version
        } else {
            versionString = chrome.i18n.getMessage("popupVersionLatestUnknown")
        }
    } catch (error) {
        versionString = chrome.i18n.getMessage("popupVersionLatestUnknown")
    }

    versionString += chrome.i18n.getMessage("popupVersionCurrent") + chrome.runtime.getManifest().version

    $("#about-version").text(versionString)
}