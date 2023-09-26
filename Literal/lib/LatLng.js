import { LazyPrototype } from "./LazyPrototype"

/**
 * 用于创建经纬度坐标实例。
 * 
 * 可作为在编程中直接引入的字面量类。相当于TMap.LatLng。
 * 
 * 腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocClass#1}
 * 
 * 请注意，在编写程序时通过访问instance或调用方法获取的都只是延迟求值的惰性函数。原则上，Literal下的腾讯地图类都是配合封装好的cuteTencentMap实例进行操作的。
 * 若您想获取对应的实际对象，可通过下例获取：
 * 
 * @example let b = new LatLng(12,3);
 * let target = LatLng.instance.apply()
 * 
 * @param {Number} lat  纬度
 * @param {Number} lng  经度
 * @method 
 * @returns {Function} 闭包函数。
 */
export class LatLng extends LazyPrototype{

    /**
     * 创建经纬度坐标实例。
     * @param {Number} lat 经度
     * @param {Number} lng 纬度
     */
    constructor(lat,lng){
        super()
        this.instance = function(){
            return new window.TMap.LatLng(lat,lng)
        }
    }

    /**
     * 获取纬度值。
     * 
     * @returns {Number}
     */
    getLat(){
        return ()=>typeof this.instance == "function"?this.instance.apply().getLat():this.instance.getLat()
    }

    /**
     * 获取经度值
     * 
     * @returns {Number} 
     */
    getLng(){
        return ()=>typeof this.instance == "function"?this.instance.apply().getLng():this.instance.getLng()
    }
}

