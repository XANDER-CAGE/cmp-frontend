import { chain } from 'lodash';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc)
dayjs.extend(timezone)


export const setTashkentTime = (date, template) => {
    return !date ? null : dayjs.utc(date).tz('Asia/Tashkent').format(template || 'YYYY-MM-DD H:mm')
}

export const setLocalTime = (date, template) => {
    return !date ? null : dayjs(new Date(date + 'Z')).format(template || 'YYYY-MM-DD H:mm')
}

export const setUTCTime = (date, template) => {
    return !date ? null : dayjs(new Date(date)).format(template || 'YYYY-MM-DD H:mm')
}

export const makeOptions = (data, label, value = 'id') => {
    if (!data) {
        return [];
    }
    return data?.map((item) => ({
        label: typeof label === 'function' ? label(item) : item[label],
        value: item[value],
    })) || [];
};

export const groupByKey = (array, keyName, itemsName = 'items') =>
    chain(array)
        .groupBy(keyName)
        .map((value, key) => ({ [keyName]: key, [itemsName]: value }))
        .value();

export const setTagColor = (type) => {
    switch (type) {
        case "Open":
            return ""
        case "InProgress":
            return "blue"
        case "Completed":
            return "green"
        case "Cancelled":
            return "red"
        case "Deferred":
            return "orange"
        case "Low":
            return "green"
        case "Medium":
            return "orange"
        case "High":
            return "red"
        default:
            return 0
    }
}

export const setMonthString = (month) => {
    switch (month) {
        case 0:
            return "January"
        case 1:
            return "February"
        case 2:
            return "March"
        case 3:
            return "April"
        case 4:
            return "May"
        case 5:
            return "June"
        case 6:
            return "July"
        case 7:
            return "August"
        case 8:
            return "September"
        case 9:
            return "October"
        case 10:
            return "November"
        case 11:
            return "December"
        default:
            return 0
    }
}

export function reFormat(num) {
    return ('' + num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function reFormatWithSpace(num) {
    return ('' + num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

export function toMln(num, fixed = 2) {
    if (num > 1000000) {
        return `${(num / 1000000).toFixed(fixed)} mln`
    } else if (num >= 1000 && num < 1000000) {
        return `${(num / 1000).toFixed(fixed)} k`
    } else {
        return num
    }
}