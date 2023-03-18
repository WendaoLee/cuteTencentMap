


/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.Map。
 * @param {string} domId  -(必填) 地图DOM容器的id，创建地图需要在页面中创建一个空div元素，传入该div元素的id 
 * @param {MapOptions} options - MapOptions,地图配置参数。详细请参见腾讯地图文档 {@link https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap#2}
 * @returns {Function} 闭包函数，用于惰性求值。
 */
export function Map(
    domId,options
){
    return function(){
        return new window.TMap.Map(domId,options)
    }
}

