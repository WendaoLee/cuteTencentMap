import { LazyPrototype } from "./LazyPrototype";
import { objectEvaluate } from "../utils";
import { LatLng } from "./LatLng";

/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.Map。
 * 请注意，类中承载的方法仅仅只是未进行阐述实现的接口。调用它不会
 * @class
 * @extends LazyPrototype
 */
export class Map extends LazyPrototype {
  /**
   * @constructor
   * @param {string} domId  -(必填) 地图DOM容器的id，创建地图需要在页面中创建一个空div元素，传入该div元素的id
   * @param {MapOptions} options - MapOptions,地图配置参数。为一个对象。详细请参见腾讯地图文档 {@link https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap#2}
   * @returns {Function} 闭包函数，用于惰性求值。
   */
  constructor(domId, options) {
    super();
    this.instance = function () {
    
      //确保在该函数执行时，可能出现同样存在延迟求值要素的参数能够保证其值符合预期
      objectEvaluate(options);

      return new window.TMap.Map(domId, options);
    };
  }

  /**
   * 设置地图中心点。它是惰性的，请配合使用
   * @param {LatLng} center 地图中心点
   * @returns {Function} 延迟执行的函数
   */
  setCenter(center){
    return ()=> {
      center = objectEvaluate(center)
      
      this.__isEvaluated__()?this.instance.setCenter(center):this.instance.apply().setCenter(center)
    }
  }
}
