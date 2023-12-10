const browserlang = navigator.language

export const formatDateOnly = (date: Date | string | number) => {
    if (!date)
        return ""
    try {
        const dateDate = new Date(date)
        let formatted = dateOnlyBrowserLang.format(dateDate)
        return formatted
    } catch(e) {
        //console.log(e)
    }
    return ""
}

export const formatDateTime = (date: Date | string | number) => {
    try {
        const dateDate = new Date(date)
        let formatted = dateTimeBrowserLang.format(dateDate)
        return formatted
    } catch(e) {
        //console.log(e)
    }
    return ""
}

export const formatDateTimeLong = (date: Date | string | number) => {
    try {
        const dateDate = new Date(date)
        let formatted = dateTimeLongBrowserLang.format(dateDate)
        return formatted
    } catch(e) {
        //console.log(e)
    }
    return ""
}

export const formatDateTimeShort = (date: Date | string | number) => {
    try {
        const dateDate = new Date(date)
        let formatted = dateTimeShortBrowserLang.format(dateDate)
        return formatted
    } catch(e) {
        //console.log(e)
    }
    return ""
}

// date only
const dateOnlyFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}

const dateOnlyBrowserLang = Intl.DateTimeFormat(browserlang, dateOnlyFormat)

// date time
const dateTimeFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
}
const dateTimeBrowserLang = Intl.DateTimeFormat(browserlang, dateTimeFormat)

// date time long
const dateTimeLongFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}
const dateTimeLongBrowserLang = Intl.DateTimeFormat(browserlang, dateTimeLongFormat)

// date time short
const dateTimeShortFormat: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
}
const dateTimeShortBrowserLang = Intl.DateTimeFormat(browserlang, dateTimeShortFormat)
