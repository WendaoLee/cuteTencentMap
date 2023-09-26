import { Map } from "./lib/Map";
import { LatLng } from "./lib/LatLng";
import { LatLngBounds } from "./lib/LatLngBounds";

Function.prototype.__bind__ = function(ref){
    ref = this.apply()
    return
}

/**
 * 相当于TMap的字面量类。请配合封装好的cuteTencentMap实例在实际代码编写过程中使用。
 * 
 * 如在确保腾讯地图类库已经加载完毕的前提下，单纯只是想有注释辅助的类库进行编程的话，请调用 Typed 模块下的 TMap 而不是 Literal 模块下的 TMap。
 * 
 * 例：
 * @example
 * import {TMap} from 'cutetencentmap/Typed/TMap.js' //单纯只是想有注释辅助的类库进行编程的话。只不过这种情况很少。
 */
export const TMap = {
    Map:Map,
    LatLng:LatLng,
    LatLngBounds:LatLngBounds
}

