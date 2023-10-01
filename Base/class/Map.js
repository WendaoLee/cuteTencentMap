import {Thunk} from '../abstract/thunk'
import {ThunkProxy,ThunkSymbol,symbolThunkProxy} from '../abstract/AbstractClass'


// export function Map(idStr,mapOptions){
//   let mapIns = new Thunk(()=>new window.TMap.Map,idStr,mapOptions)
//   mapIns.setCenter = ()=>1
//   return mapIns
// }



class LatLngThunk extends ThunkSymbol{

  /**
   * 获取纬度值.
   * 调用该方法获取的是一个未被估值的Thunk。
   * @returns {number}
   */
  getLat(){
  }

  /**
   * 返回经度值.
   * 调用该方法获取的是一个未被估值的Thunk。
   * @returns {number}
   */
  getLng(){

  }
}

/**
 * 相当于 TMap.Map。
 * 使用它生成的实例为 Map 的 ThunkProxy。可借助该 ThunkProxy 书写基于 Map 的种种操作。
 */
export class Map extends ThunkProxy{

  target
  targetRef

  /**
   * 创建地图实例。
   * @param {String} domId (必填)地图DOM容器的id，创建地图需要在页面中创建一个空div元素，传入该div元素的id
   * @param {*} mapOptions 地图参数，对象规范详见{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap#2 MapOptions}
   * @returns 
   */
  constructor(domId,mapOptions = null){
    super()
    if(mapOptions == null){
      this.target = new Thunk(()=>window.TMap.Map,domId,symbolThunkProxy)
      this.targetRef = this.target.contextTarget
      return
    }
    this.target = new Thunk(()=>window.TMap.Map,domId,mapOptions,symbolThunkProxy)
    this.targetRef = this.target.contextTarget
  }

  /**
   * 获取代表 Map 的 Thunk。
   * @returns {Thunk} 
   */
  thunk(){
    return this.target
  }

  /**
   * 获取地图中心。
   * 调用该方法获取的是一个未被估值的Thunk。该Thunk可操作，操作同LatLng
   * @returns {LatLngThunk}
   */
  getCenter(){
    let latLngThunk = new Thunk(()=>this.target.getCenter,)
    latLngThunk.getLat = ()=> new Thunk(()=>this.target.getCenter().getLat,)
    latLngThunk.getLng = ()=> new Thunk(()=>this.target.getCenter().getLng,)
    return latLngThunk
  }

  /**
   * 设置地图中心
   * @param {LatLngThunk} latLng 经纬度。代表TMap.LatLng的Thunk。
   * @returns {ThunkProxy} 返回Map的ThunkProxy
   */
  setCenter(latLng){
    let setCenter = ()=>{
      console.log(this)
      return this.targetRef.val.setCenter.bind(this.targetRef.val)
    }
    let t = new Thunk(setCenter,latLng)
    return this
  }
}

