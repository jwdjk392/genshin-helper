init()

function init() {
    loadLocale()
    loadSettings()
}

function loadLocale() {
    $("html").attr("lang", chrome.i18n.getUILanguage())
    $("#auto-checkin").text(chrome.i18n.getMessage("optionAutoCheckIn"))
    $("#auto-checkin-switch-text").text(chrome.i18n.getMessage("optionAutoCheckInSwitch"))
    //$("#redeem-method").text(chrome.i18n.getMessage("optionRedeemMethod"))
    //$("#redeem-method-switch-text").text(chrome.i18n.getMessage("optionRedeemMethodSwitch"))
    //$("#redeem-method-description").text(chrome.i18n.getMessage("optionRedeemMethodSwitchDescription"))
}

function loadSettings() {
    chrome.storage.local.get(null, function(items) {
        console.log(items)
        $('input[data-settings="true"]').each(function() {
            const input = $(this)
            const key = input.data('settingsid')

            if (key in items) {
                const value = items[key]

                if (input.is(":checkbox")) {
                    input.prop("checked", value)
                } else {
                    input.val(value)
                }
            }
        })
    })
}

$("#auto-checkin-switch").on("change", function () {
    chrome.storage.local.set({autoCheckIn: $("#auto-checkin-switch").is(':checked')})
})

$('input[data-settings="true"]').on("change", function () {
    const key = $(this).data('settingsid')
    const value = $(this).is(':checkbox') ? $(this).is(":checked") : $(this).val()

    if (key) {
        chrome.storage.local.set({[key]: value}, function () {
            console.log("Saved ", key, " : ", value)
        })
    }
})