export function debug(...msg){
    console.debug(`[cuteTencentMap-debug - ${new Date().toISOString()}]`,msg)
}

export function info(...msg){
    console.info(`[cuteTencentMap-log - ${new Date().toISOString()}]`,msg)
}

export function warn(...msg){
    console.warn(`[cuteTencentMap-warn - ${new Date().toISOString()}]`,msg)
}

export function error(...msg){
    console.error(`[cuteTencentMap-log - ${new Date().toISOString()}]`,msg)
}