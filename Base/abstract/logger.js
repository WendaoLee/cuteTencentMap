
let isLoggerEnable = false

let msgCollection = []

export function debug(...msg){
    if(isLoggerEnable){
        console.debug(...msg)
    }
}

export function enableLogger(){
    isLoggerEnable = true
}