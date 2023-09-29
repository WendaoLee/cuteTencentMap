import {Thunk} from '../abstract/thunk'
import {ThunkProxy,ThunkSymbol,symbolThunkProxy} from '../abstract/AbstractClass'

/**
 * 相当于 TMap.LatLng。
 * 使用它生成的实例为 LatLng 的 ThunkProxy。可借助该 Proxy 书写基于 LatLng 的种种操作。
 * 将它作为其他函数的传入参数时，应当调用thunk()方法获取thunk
 */
export class LatLng extends ThunkProxy{

    target

    /**
     * 
     * @param {number} lat 
     * @param {number} lng 
     */
    constructor(lat,lng){
        super()
        this.target = new Thunk(()=>window.TMap.LatLng ,lat,lng,symbolThunkProxy)
    }

  thunk(){
    return this.target
  }
}
