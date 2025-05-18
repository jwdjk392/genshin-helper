init()

function init() {
    loadLocale()
    loadSettings()
}

function loadLocale() {
    $("html").attr("lang", chrome.i18n.getUILanguage())
    $("#auto-checkin").text(chrome.i18n.getMessage("optionAutoCheckIn"))
    $("#auto-checkin-switch-text").text(chrome.i18n.getMessage("optionAutoCheckInSwitch"))
}

function loadSettings() {
    chrome.storage.local.get("autoCheckIn", (data) => {
        if (data.autoCheckIn) {
            $("#auto-checkin-switch").prop("checked", true)
        } else {
            $("#auto-checkin-switch").prop("checked", false)
        }
    })
}

$("#auto-checkin-switch").on("change", function () {
    chrome.storage.local.set({autoCheckIn: $("#auto-checkin-switch").is(':checked')})
})