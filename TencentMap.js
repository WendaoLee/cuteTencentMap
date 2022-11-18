import "./TencentMapClass"
import {functional_evaluation} from './utils'
import { TMap, TMap_LatLng, TMap_LatLngBounds } from "./TencentMapClass"
/**
 * 这是cuteTencentMap自封装的一个类，用于在一个实例中维护地图的种种状态。
 */
export class TencentMap {

    /**
     * 事件队列控制的相关状态
     * @member {Array} eventQueue - 事件队列。里面的事件对象会阻塞进行，即除非上一个事件已经完成，否则下一个事件不会运行。它是一个数组。里面会存放一个这样的事件对象:{fuc:your_excute_fuction,delay:delay_miliseconds}。通常里面的fuc会通过Function.bind()方法创建。
     * @member {Number} eventIntervalId - 循环定时器的id。通过setInterval得到。我们通过重设循环定时器的循环时间来实现事件的阻塞运行。
     */
    eventQueue
    eventIntervalId
    eventDelayTime

    instance
    multiMarkerLayer
    multiPolyLineLayer
    multiPolygonLayer
    multiLabelLayer

    /**
     * 储存初始化时传入的状态
     */
    theState = {
        theKey: null,
        theCallerRef: null,
        theRootElement: null,
        theKeyProjectName: null
    }

    /**
     * 初始化地图
     * @param {object} opts 初始化地图选项,为一个对象。见下：
     * - rootElemnt 地图挂载的dom元素id。如“mapContainer”
     * - theKey 开发key。
     * - library 附加库。默认加载所有库。它为一个字符串数组，如['visualization', 'tools']
     * @returns 
     * @class TencentMap
     */
    constructor({
        rootElement = undefined,
        theKey = undefined,
        library = ['visualization', 'tools', 'geometry', 'model', 'view', 'service'],
        isInit = false
    }) {

        this.theState = {
            theKey: theKey,
            theRootElement: rootElement,
            isInit: isInit
        }

        console.log("Class construct this:", this)


        this.instance = null
        this.multiMarkerLayer = {}
        this.multiLabelLayer = {}
        this.eventQueue = []
        this.eventDelayTime = 1000

        this.eventIntervalId = setInterval(
            this._eventQueueStart.bind(this), 1000
        )

        let constructLibraries = (oldstr, ...newstr) => newstr.length == 0 ? oldstr : oldstr + ',' + newstr //即使传入为空也不会影响正常使用


        let that = this

        let isAPIScriptNotImport = (document.getElementById("TencentMapJsV1Import") == null)
        if (isAPIScriptNotImport) {
            let script = document.createElement("script")
            script.id = "TencentMapJsV1Import"
            script.type = "text/javascript"
            script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${theKey}&libraries=${constructLibraries.apply(null, library)}`
            document.body.appendChild(script)
        }

        if (isInit) {
            window.addEventListener('load', () => {
                that._defaultMapSet()
            })
        }

        return this
    }

    _eventQueueStart() {
        // console.log("Now,this is :",this)
        //确保API资源等都已经加载完毕
        if (!document.readyState == "complete" || document.getElementById("TencentMapJsV1Import") == null) {
            return
        }
        if (this.eventQueue.length == 0 && this.eventDelayTime != 1000) {
            clearInterval(this.eventIntervalId)
            this.eventIntervalId = setInterval(
                this._eventQueueStart.bind(this), 1000
            )
            return
        }
        if (this.eventQueue.length == 0 && this.eventDelayTime == 1000) {
            return
        }

        let { func, delay } = this.eventQueue[0]
        setTimeout(
            func, delay
        )
        this.eventQueue.shift()

        //通过重设事件队列计时器来确保堵塞。
        clearInterval(this.eventIntervalId)
        this.eventIntervalId = setInterval(
            this._eventQueueStart.bind(this), delay
        )
    }

    _defaultMapSet() {
        this.instance = new window.TMap.Map(
            document.getElementById(
                this.theState.theRootElement
            ),
            {
                center: new window.TMap.LatLng(30.412919, 111.75407),
                zoom: 11.23
            }
        )
    }

    _unexpectedEvent(msg) {
        console.warn('some unexpected event occur in queue:', msg)
    }

    /**
     * 初始化地图。这是cuteTencentMap自包装的一个方法。
     * 所有cuteTencentMap自包装的方法采取大驼峰式命名，即MethodName。
     * @param {*} rootElement 地图挂载的根元素名
     * @param {*} mapOptions 地图参数，以一个对象传入。参见腾讯地图MapOptions文档。需要注意的地方有：
     * - mapZoomType 值为0(对应'DEFAULT') || 1(对应'CENTER')。您可以使用内置的枚举模块进行传值。
     * - boundary 如果不使用惰性求值类传值，请按照{sw:{lat:number,lng:number},ne:{lat:number,lng:number}}的格式传值。
     */
    BuildMap(rootElement, {
        center = {
            Lat: 30.412919,
            Lng: 111.75407
        },
        zoom = 18,
        minZoom = 3,
        maxZoom = 20,
        rotation = 0,
        pitch = 0,
        scale = 1,
        offset = {
            x: 0,
            y: 0
        },
        draggable = true,
        scrollable = true,
        pitchable = true,
        rotatable = true,
        doubleClickZoom = true,
        mapZoomType = undefined,
        boundary = undefined,
        mapStyleId = undefined,
        baseMap = undefined,
        viewMode = undefined,
        showControl = true,
        renderOptions = undefined,
        clip = undefined
    }) {

        /*
         * 确保API资源已经被加载，如果没有，则将它放入eventQueue中延后执行。
         */
        if (!this._isResourcesLoaded(this.BuildMap, rootElement,
            {
                center, zoom, minZoom, maxZoom, rotation, pitch, scale, offset, draggable,
                scrollable, pitchable, rotatable, doubleClickZoom, mapZoomType, boundary, mapStyleId, baseMap, viewMode,
                showControl, renderOptions, clip
            }
        )) {
            return this
        }

        console.log(center)

        function isFunction(val) {
            return typeof val == "function" || val == undefined
        }

        function EvaluationExcute(val) {
            if (typeof val == "function") {
                return val()
            }
            return val
        }

        let mapOptions = {
            center: isFunction(center) ? center : TMap_LatLng(center.Lat, center.Lng),
            zoom: zoom,
            minZoom: minZoom,
            maxZoom: maxZoom,
            rotation: rotation,
            pitch: pitch,
            scale: scale,
            offset: offset,
            draggable: draggable,
            scrollable: scrollable,
            pitchable: pitchable,
            rotatable: rotatable,
            doubleClickZoom: doubleClickZoom,
            mapZoomType: mapZoomType,
            boundary: isFunction(boundary) ? boundary : TMap_LatLngBounds({ sw: boundary.sw, ne: boundary.ne }),
            mapStyleId: mapStyleId,
            baseMap: baseMap,
            viewMode: viewMode,
            showControl: showControl,
            renderOptions: renderOptions,
            clip: clip
        }
        
        functional_evaluation(mapOptions)

        console.log(mapOptions)


        this.instance = new window.TMap.Map(
            document.getElementById(
                this.theState.theRootElement
            ),
            mapOptions
        )

        return this
    }

    /**
     * 在当前地图添加一个新的MultiMarker。
     * @param {*} multiMarkerName 
     * @param {*} opts 
     */
    BuildNewMultiMarker(multiMarkerName, {
        zIndex,
        styles,
        enableCollision = false,
        geometries }
    ) {
        if (!this._isMapInit(this.BuildNewMultiMarker, multiMarkerName,
            {
                zIndex, styles, enableCollision, geometries
            }
        )) {
            return this
        }

        functional_evaluation(styles)
        functional_evaluation(geometries)

        this.multiMarkerLayer[multiMarkerName] = new MultiMarker({
            id: multiMarkerName,
            map: this.instance,
            zIndex: zIndex,
            styles: styles,
            enableCollision: enableCollision,
            geometries: geometries
        })

        return this
    }

    BuildNewMultiLabel(multiLabelName,{styles,enableCollision,geometries}){
        if(!this._isMapInit(this.BuildNewMultiLabel,multiLabelName,
            {
                styles,enableCollision,geometries
            }
            )){
                return this
            }
        functional_evaluation(styles)
        functional_evaluation(geometries)

        this.multiLabelLayer[multiLabelName] = new MultiLabel({
            id:multiLabelName,
            map:this.instance,
            styles:styles,
            enableCollision:enableCollision,
            geometries:geometries
        })

        return this
    }

    /**
     * 设置地图中心点。
     * @param {*} centeropts 以对象形式传入经度与纬度、或者传入中心点坐标。请注意，当经纬度与中心点坐标同时传入时，会优先
     * - lat Number 经度
     * - lng Number 纬度
     * - center TMap.LatLng 中心坐标。请使用Literal_TMap_LatLng构建。
     * @returns 
     */
    setCenter({ lat, lng, center }) {
        if (!this._isMapInit(this.setCenter, { lat, lng, center })) {
            return this
        }

        if (center != undefined) {
            this.instance.setCenter(center())
            return this
        }

        if (lat != undefined) {
            this.instance.setCenter(TMap_LatLng(lat, lng))
            return this
        }
    }

    /**
     * @deprecated map实例的通用Getter。主要是目前没有精力专门封装对应的Getter所以设置了这个方法。这个方法是糟糕的，因为它使用了可能会带来漏洞的eval()代码。
     * @param {*} methodstr 原方法名。如原本腾讯地图方法为map.getZoom()，那么，传入"getZoom"即可。
     */
    getter(methodstr) {
        if (!this._isMapInit(this._unexpectedEvent, "getter" + methodstr)) {
            return undefined
        }
        return eval(`this.instance.${methodstr}()`)
    }

    /**
     * 设置地图缩放级别
     * @param {Number} zoom 缩放级别 
     * @returns 
     */
    setZoom(zoom) {
        if (!this._isMapInit(this.setZoom, zoom)) {
            return this
        }

        this.instance.setZoom(zoom)
        return this
    }

    setRotation(rotation) {
        if (!this._isMapInit(this.setRotation, rotation)) {
            return this
        }

        this.instance.setRotation(rotation)
        return this
    }

    setPitch(pitch) {
        if (!this._isMapInit(this.setPitch, pitch)) {
            return this
        }

        this.instance.setPitch(pitch)
        return this
    }

    setScale(scale) {
        if (!this._isMapInit(this.setScale, scale)) {
            return this
        }

        this.instance.setScale(scale)
        return this
    }
    setOffset(offset) {
        if (!this._isMapInit(this.setOffset, offset)) {
            return this
        }

        this.instance.setOffset(offset)
        return this
    }

    setDraggable(draggable) {
        if (!this._isMapInit(this.setDraggable, draggable)) {
            return this
        }

        this.instance.setDraggable(draggable)
        return this
    }

    setScrollable(scrollable) {
        if (!this._isMapInit(this.setScrollable, scrollable)) {
            return this
        }

        this.instance.setScrollable(scrollable)
        return this
    }

    setMaxZoom(maxZoom) {
        if (!this._isMapInit(this.setMaxZoom, maxZoom)) {
            return this
        }

        this.instance.setMaxZoom(maxZoom)
        return this
    }
    setMinZoom(minZoom) {
        if (!this._isMapInit(this.setMinZoom, minZoom)) {
            return this
        }

        this.instance.setMinZoom(minZoom)
        return this
    }


    setPitchable(pitchable) {
        if (!this._isMapInit(this.setPitchable, pitchable)) {
            return this
        }
        this.instance.setPitchable(pitchable)
        return this
    }

    setRotatable(rotatable) {
        if (!this._isMapInit(this.setRotatable, rotatable)) {
            return this
        }
        this.instance.setRotatable(rotatable)
        return this
    }

    setDoubleClickZoom(doubleClickZoom) {
        if (!this._isMapInit(this.setDoubleClickZoom, doubleClickZoom)) {
            return this
        }
        this.instance.setDoubleClickZoom(doubleClickZoom)
        return this
    }

    setViewMode(mode) {
        if (!this._isMapInit(this.setViewMode, mode)) {
            return this
        }
        this.instance.setViewMode(mode)
        return this
    }


    setBaseMap(baseMap) {
        if (!this._isMapInit(this.setBaseMap, baseMap)) {
            return this
        }
        this.instance.setBaseMap(baseMap)
        return this
    }

    setMapStyleId(mapStyleId) {
        if (!this._isMapInit(this.setMapStyleId, mapStyleId)) {
            return this
        }
        this.instance.setMapStyleId(mapStyleId)
        return this
    }

    /**
     * 获取地图中心坐标。
     * @mention 请在确保地图实例已经构建时调用，否则它会返回undefined。
     * @todo 关于Getter，在未来考虑以更为有效的方法来确保能够得到数据。
     * @returns {TMap.LatLng} 地图中心点坐标
     */
    getCenter() {
        if (!this._isMapInit(this.getCenter,)) {
            console.log("map not init")
            return undefined
        }
        return this.instance.getCenter()
    }

    /**
     * 为地图绑定事件。
     * @param {*} eventname 
     * @param {*} listener 
     * @returns 
     */
    on(eventname, listener) {
        if (!this._isMapInit(this.on, eventname, listener)) {
            return this
        }

        this.instance.on(eventname, listener)
        return this
    }

    /**
     * 为地图解绑事件。
     * @param {*} eventname 
     * @param {*} listener 
     * @returns 
     */
    off(eventname, listener) {
        if (!this._isMapInit(this.off, eventname, listener)) {
            return this
        }

        this.instance.off(eventname, listener)
        return this
    }

    /**
     * 调整地图显示范围
     * @param {TMap.LatLngBounds} bounds 如果没有边界对象，请使用Literal_TMap_LatLngBounds构造传入。
     * @param {FitBoundsOptions} options 参见腾讯地图文档。
     * @returns 
     */
    fitBounds(bounds, options) {
        if (!this._isMapInit(this.fitBounds, bounds, options)) {
            return this
        }

        typeof bounds == "function" ? this.instance.fitBounds(bounds(), options) : this.instance.fitBounds(bounds, options)
        return this
    }


    /**
     * 传入一个调用者内的实例，将它与MultiMark绑定，从而可以通过该实例对MultiMark进行操作。支持链式调用。
     * @param {reference} ref 
     */
    util_BindMultiMark(ref) {
        ref = this.MultiMarker
        ref
        return this
    }

    _isResourcesLoaded(fn, ...context) {
        if (document.readyState != "complete" || document.getElementById("TencentMapJsV1Import") == null) {
            console.log("Hook works in isResources,readyState:", document.readyState)
            console.log("the resources import:", document.getElementById("TencentMapJsV1Import") == null)
            let event = {
                func: fn.bind(this, ...context),
                delay: 1500
            }
            this.eventQueue.push(event)
            return false
        }
        return true
    }

    _isMapInit(fn, ...context) {
        if (this.instance == undefined || this.instance == null) {

            let event = {
                func: fn.bind(this, ...context),
                delay: 0
            }
            this.eventQueue.push(event)
            return false
        }
        return true
    }
}


// https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker#2
/**
 * 再封装的MultiMarker类。表示一个标记土层。
 * 请注意：它没有像@class TencentMap 那样，存在一个Hook来确保对应腾讯地图API资源已经被加载。因此，你应该在确保对应API资源加载完成后调用该类。推荐的做法是不在代码中直接引入该类，而是一切
 * 通过@class TencentMap 封装的实例进行操作。
 */
export class MultiMarker {
    constructor({
        id = undefined,
        map = null,
        zIndex,
        styles,
        enableCollision = false,
        geometries
    }) {
        if (document.readyState != "complete" || document.getElementById("TencentMapJsV1Import") == null) {
            console.error("Resources not loaded.At MultiMark constructor.")
            return undefined
        }

        this.layer = new window.TMap.MultiMarker({
            map: map,
            styles: styles,
            id: id,
            zIndex: zIndex,
            enableCollision: enableCollision,
            geometries: geometries
        })

        return this
    }

    setMap(map){
        this.layer.setMap(map)
    }

    setGeometries(geometries){
        this.layer.setGeometries(geometries)
    }

    setStyles(styles){
        this.layer.setStyles(styles)
    }

    setVisible(visible){
        this.layer.setVisible(visible)
    }

    remove(ids){
        this.layer.remove(ids)
    }

    on(eventname,func){
        this.layer.on(eventname,func)
    }

    off(eventname,func){
        this.layer.off(eventname,func)
    }

}


export class MultiLabel{
    constructor({
        id=undefined,
        map=null,
        styles,
        enableCollision,
        geometries
    }){
        if (document.readyState != "complete" || document.getElementById("TencentMapJsV1Import") == null) {
            console.error("Resources not loaded.At MultiMark constructor.")
            return undefined
        }

        this.layer = new window.TMap.MultiLabel({
            id:id,
            map:map,
            styles:styles,
            enableCollision:enableCollision,
            geometries:geometries
        })

        return this
    }
}