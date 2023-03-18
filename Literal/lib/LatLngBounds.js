

/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.LatLngBounds。
 * 但与原函数不同的地方在于，我们为了便捷使用是按照西南角（纬度-经度）-东北角（纬度-经度）的顺序传入的。
 * 原腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocClass#2}
 * @param {Number} sw_lat 边界的西南角（左下角）纬度。
 * @param {Number} sw_lng 边界的西南角（左下角）经度。
 * @param {Number} ne_lat 边界的东北角（右上角）纬度。
 * @param {Number} ne_lng 边界的东北角（右上角）经度。
 * @returns {Function} 闭包函数。用于延迟求值。
 */
export function LatLngBounds(sw_lat,sw_lng,ne_lat,ne_lng){
    return function(){
        return new window.TMap.LatLngBounds(
            window.TMap.LatLng(sw_lat,sw_lng),
            window.TMap.LatLng(ne_lat,ne_lng)
        )
    }
}