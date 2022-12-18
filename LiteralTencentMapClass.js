/**
 * 作为在编程中直接引入的字面量函数。
 * 因为在Javascript编译执行时不一定加载完成了腾讯地图JavascriptAPI，为了在编程重能够便捷使用腾讯地图的相关函数，必需使用字面量函数实现延迟求值——或者说惰性求值。
 * 
 * 
 * @todo 添加TMap.GradientColor
 */

/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.LatLng。
 * 腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocClass#1}
 * @param {Number} lat  纬度
 * @param {Number} lng  经度
 * @returns {Function} 闭包函数。用于延迟求值。
 */
export function TMap_LatLng(lat,lng){
    return function(){
        return new window.TMap.LatLng(lat,lng)
    }
}

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
export function TMap_LatLngBounds(sw_lat,sw_lng,ne_lat,ne_lng){
    return function(){
        return new window.TMap.LatLngBounds(
            window.TMap.LatLng(sw_lat,sw_lng),
            window.TMap.LatLng(ne_lat,ne_lng)
        )
    }
}

/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.Point。用于创建二维坐标点。
 * 腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocClass#3}
 * @param {Number} x 
 * @param {Number} y 
 * @returns 
 */
export function TMap_Point(x,y){
    return function(){
        return new window.TMap.Point(x,y)
    }
}

/**
 * @todo 添加TMap.GradientColor
 * @param {*} param0 
 */
function TMap_GradientColor({}){

}


/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.MarkerStyle。为MarkerStyle配置参数。
 * 腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker#4}
 * @param {Object} MarkerStyleOptions - MarkerStyle配置参数。
 * @param {Number} MarkerStyleOptions.width - 必需，标注点图片的宽度，默认为34。
 * @param {Number} MarkerStyleOptions.height - 必需，标注点图片的高度，默认为50
 * @param {Object} MarkerStyleOptions.anchor - 标注点图片的锚点位置，对象字面量{x:Number, y:Number}形式，在地图各种操作中，锚点的位置与标注位置点是永远对应的；若没有锚点默认为{ x: width/2, y: height }；锚点以图片左上角点为原点.
 * @param {String} MarkerStyleOptions.src - 标注点图片url或base64地址，若为url地址图片一定要在服务器端配置允许跨域。
 * @param {String} MarkerStyleOptions.faceTo - 标注点图片的朝向，可取’map’（贴地）或’screen’（直立），默认为’screen’。
 * @param {Number} MarkerStyleOptions.rorate - 标注点图片的旋转角度，单位为度，非负数；以锚点为旋转原点，逆时针为正。
 * @param {String} MarkerStyleOptions.color - 标注点文本颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,1) 。
 * @param {String} MarkerStyleOptions.strokeColor - 标注点文本描边颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,0)。
 * @param {Number} MarkerStyleOptions.strokeWidth - 标注点文本描边宽度，默认为1。
 * @param {Number} MarkerStyleOptions.size - 标注点文本文字大小属性，默认为14。
 * @param {String} MarkerStyleOptions.direction - 标注点文本文字相对于标注点图片的方位，可选位于标注点图片的center，top，bottom，left，right方位，默认位于图片的中心center 。
 * @param {Object} MarkerStyleOptions.offset - 标注点文本文字基于direction方位的偏移量，单位为像素，以文本文字中心为原点，x轴向右为正向左为负，y轴向下为正向上为负，默认为{x:0, y:0} 。
 * @param {Number} MarkerStyleOptions.offset.x - 标注点文本文字基于direction方位的偏移量，单位为像素，以文本文字中心为原点，x轴向右为正向左为负，y轴向下为正向上为负，默认为{x:0, y:0} 。
 * @param {Number} MarkerStyleOptions.offset.y - 标注点文本文字基于direction方位的偏移量，单位为像素，以文本文字中心为原点，x轴向右为正向左为负，y轴向下为正向上为负，默认为{x:0, y:0} 。
 * @returns {Function} 闭包函数。用于延迟求值。
 */
export function TMap_MarkerStyle({
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


/**
 * 可作为在编程中直接引入的字面量函数。相当于TMap.LabelStyle。表示应用于多标注图层的样式类型。
 * 腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocLabel#4}
 * @param {Object} LabelStyleOptions 应用于多标注图层的样式类型的配置参数。
 * @param {String} LabelStyleOptions.color 颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,1)。
 * @param {Number} LabelStyleOptions.size 文字大小属性，默认为14。
 * @param {Object} LabelStyleOptions.offset 文字偏移属性，单位为像素，以PointGeometry的位置点所对应屏幕位置为原点，x轴向右为正向左为负，y轴向下为正向上为负，默认为{x:0, y:0}。
 * @param {Number} LabelStyleOptions.offset.x x轴向右为正向左为负。默认为{x:0, y:0}。
 * @param {Number} LabelStyleOptions.offset.y y轴向下为正向上为负。默认为{x:0, y:0}。
 * @param {Number} LabelStyleOptions.angle 文字旋转属性，单位为度，以PointGeometry的位置点所对应屏幕位置为原点，逆时针为正，默认为0。
 * @param {String} LabelStyleOptions.alignment 文字水平对齐属性，默认为center，可选值为left（文字左侧与位置锚点对齐）、right（文字右侧与位置锚点对齐）、center（文字水平中心与位置锚点对齐）。
 * @param {String} LabelStyleOptions.verticalAlignment 文字垂直对齐属性，默认为middle，可选值为top（文字顶部与位置点对齐）、bottom（文字底部与位置点对齐）、middle（文字垂直中心与位置点对齐）。
 * @param {Number} LabelStyleOptions.height 文字背景框高度，单位为像素。
 * @param {Number} LabelStyleOptions.width 文字背景框宽度，单位为像素。
 * @param {String} LabelStyleOptions.backgroudColor 文字背景框颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,0)。
 * @param {String} LabelStyleOptions.padding 文字背景框内边距，单位为像素，属性支持接受1～2个值，规则符合css规范。
 * - 例：“15px” 上下左右内边距为15px
 * - 例：“15px 20px” 上下内边距为15px，左右内边距为20px
 * - 注意设置宽高后padding将不生效
 * @param {Number} LabelStyleOptions.borderWidth 文字背景框边线宽度，单位为像素。
 * @param {Number} LabelStyleOptions.borderRadius 文字背景框圆角，单位为像素。
 * @param {String} LabelStyleOptions.borderColor 文字背景框边线颜色属性，支持rgb()，rgba()，#RRGGBB等形式，默认为rgba(0,0,0,0)。
 * @returns {Function} 闭包函数。用于延迟求值。
 */
export function TMap_LabelStyle({color,size,offset,angle,alignment,verticalAlignment,height,width,backgroudColor,padding,borderWidth,borderRadius,borderColor}){
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
 * 腾讯地图文档地址：{@link https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker#6}
 * 
 * @param {*} id 
 * @param {*} styleId 
 * @param {Literal_PointGeometry|Object} position 可以是Literal_TMap_LatLng返回的坐标或是一个坐标对象{lat:Number,lng:Number}
 * @param {*} rank 
 * @param {*} properties 
 * @param {*} content 
 * @returns 
 */
export function PointGeometry({id,styleId,position,rank,properties,content}){
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

export function LabelGeometry({id,styleId,position,content,rank,properties}){
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