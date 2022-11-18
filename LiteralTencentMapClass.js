
/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.LatLng
 * @param {*} lat  纬度
 * @param {*} lng  经度
 * @returns 
 */
export function Literal_TMap_LatLng(lat,lng){
    return function(){
        return new window.TMap.LatLng(lat,lng)
    }
}

/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.LatLngBounds
 * @param {*} sw_lat 边界的西南角（左下角）纬度。
 * @param {*} sw_lng 边界的西南角（左下角）经度。
 * @param {*} ne_lat 边界的东北角（右上角）纬度。
 * @param {*} ne_lng 边界的东北角（右上角）经度。
 * @returns 
 */
export function Literal_TMap_LatLngBounds(sw_lat,sw_lng,ne_lat,ne_lng){
    return function(){
        return new window.TMap.LatLngBounds(
            window.TMap.LatLng(sw_lat,sw_lng),
            window.TMap.LatLng(ne_lat,ne_lng)
        )
    }
}


export function Literal_TMap_MarkerStyle({
    width=34,
    height=50,
    anchor={
        x:width/2,
        y:height
    },
    src,
    faceTo='screen',
    rotate,
    color,
    strokeColor,
    strokeWidth=1,
    size=14,
    direction='center',
    offset={
        x:0,
        y:0
    }
}){
    return function(){
        return new window.TMap.MarkerStyle({
            width:width,
            height:height,
            anchor:anchor,
            src:src,
            faceTo:faceTo,
            rotate:rotate,
            color:color,
            strokeColor:strokeColor,
            strokeWidth:strokeWidth,
            size:size,
            direction:direction,
            offset:offset
        })
    }
}


export function Literal_TMap_LabelStyle({color,size,offset,angle,alignment,verticalAlignment,height,width,backgroudColor,padding,borderWidth,borderRadius,borderColor}){
    return function(){
        return new window.TMap.LabelStyle({
            color:color,
            size:size,
            offset:offset,
            angle:angle,
            alignment:alignment,
            verticalAlignment:verticalAlignment,
            height:height,
            width:width,
            backgroudColor:backgroudColor,
            padding:padding,
            borderWidth:borderWidth,
            borderRadius:borderRadius,
            borderColor:borderColor
        })
    }
}

/**
 * 可作为在编程中直接引入的字面量函数，用于得到一个PointGeometry（点标记）的惰性求值对象。
 * 腾讯地图文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker#6
 * 
 * @param {*} id 
 * @param {*} styleId 
 * @param {Literal_PointGeometry|Object} position 可以是Literal_TMap_LatLng返回的坐标或是一个坐标对象{lat:Number,lng:Number}
 * @param {*} rank 
 * @param {*} properties 
 * @param {*} content 
 * @returns 
 */
export function Literal_PointGeometry({id,styleId,position,rank,properties,content}){
    if(typeof position == "function"){
        return function(){
            return{
                id:id,
                styleId:styleId,
                position:position,
                rank:rank,
                properties:properties,
                content:content
            }
        }
    }
    return function(){
        return {
            id:id,
            styleId:styleId,
            position:Literal_TMap_LatLng(position.lat,position,lng),
            rank:rank,
            properties:properties,
            content:content
        }
    }
}

export function Literal_LabelGeometry({id,styleId,position,content,rank,properties}){
    if(typeof position == "function"){
        return function(){
            return{
                id:id,
                styleId:styleId,
                position:position,
                rank:rank,
                properties:properties,
                content:content
            }
        }
    }
    return function(){
        return {
            id:id,
            styleId:styleId,
            position:Literal_TMap_LatLng(position.lat,position,lng),
            rank:rank,
            properties:properties,
            content:content
        }
    }
}