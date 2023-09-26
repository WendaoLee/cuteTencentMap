import {Thunk} from './thunk'
import { thunkHook } from './hook'


// export function Map(idStr,mapOptions){
//   let mapIns = new Thunk(()=>new window.TMap.Map,idStr,mapOptions)
//   mapIns.setCenter = ()=>1
//   return mapIns
// }

class ThunkProxy{
  __type__ = "ThunkProxy"
}

class ThunkSymbol{
  __type__ = "ThunkSymbol"
}

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

class Map extends ThunkProxy{

  target

  constructor(idStr,mapOptions){
    this.target = new Thunk(()=>new window.TMap.Map,idStr,mapOptions)
  }

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

  setCenter(latLng){
    let t = new Thunk(()=>this.target.setCenter,latLng)
  }
}

let a = new Map("dom")
let center = a.getCenter()
center.getLat()
