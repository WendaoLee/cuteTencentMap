import {info,warn,debug,error} from "./logger"
import { TMap } from "./Literal/TMap"

const IMPORT_SCRIPT_ID = "TENCENTMAP_JS_IMPORT"

/**
 * 封装好的腾讯地图类库。
 * @class
 */
export class cuteTencentMap{

    /**
     * @member {Array} [eventQueue]
     * 
     * 事件队列。里面的事件对象会阻塞进行，即除非上一个事件已经完成，否则下一个事件不会运行。
     * 
     * 事件队列中存储的事件是如下例所示的对象：
     * @example
     * {evt:function,delay:number}
     * 
     * @summary cuteTencentMap自身存在一个伪堵塞式的事件循环机制。这是由于Javascript是即时解释执行而做出的设计，
     * 如果不存在这样的伪堵塞式的事件循环机制，那么我们无法确保在腾讯地图库加载完毕后代码执行的逻辑顺序能够符合我们的
     * 代码编写。
     * 
     * 这一堵塞式的事件循环机制依靠循环Interval的函数eventCycle实现
     */
    #eventQueue

    /**
     * @member {number} [eventIntervalId]
     * 
     * 控制控制实例自身事件循环的计时器Id。
     */
    #eventIntervalId


    /**
     * @member {number} [eventDelayTime]
     * 
     * 当前事件循环的循环时间。默认为1000，单位为毫秒。
     */
    #eventDelayTime


    /**
     * 事件循环机制逻辑
     * 
     * @function 
     */
    #eventLoop(){

        debug(this.#eventQueue.length)

        // 若资源未完成加载，那么无须执行接下来的判断逻辑，直接退出继续循环
        if(document.readyState != "complete" && document.getElementById(IMPORT_SCRIPT_ID) == null){
            return
        }

        if(window.TMap === undefined){
            debug("发生资源完成加载，但不存在腾讯地图TMap的情况。此时",this)
            return
        }

        // 当事件队列长度为0且事件循环时间为默认的值，则说明没有需要堵塞执行的事件，可直接退出继续循环
        if(this.#eventQueue.length == 0 && this.#eventDelayTime == 1000){
            return
        }

        // 在无事件等待执行的情况下，若事件循环时间不为默认时间，为了消除堵塞带来的状态修改的影响，需要复位循环时间为默认值
        if(this.#eventQueue.length == 0 && this.#eventDelayTime != 1000){
            clearInterval(this.#eventIntervalId)
            this.#eventIntervalId = setInterval(
                this.#eventLoop.bind(this),1000
            )
            return
        }

        let {evt,delay} = this.#eventQueue[0]
        setTimeout(evt,delay)
        this.#eventQueue.shift()

        // 通过更改队列循环时间的状态确保事件按序运行
        clearInterval(this.#eventIntervalId)
        this.#eventIntervalId = setInterval(
            this.#eventLoop.bind(this),delay
        )
    }

    /**
     * @member {TMap.Map} [map]
     * 
     * 腾讯地图实例
     */
    map = new TMap.Map()



    /**
     * 构造封装好的cuteTencentMap实例。可通过该实例进行对地图的种种操作。
     * @param {Object} options 配置项，为包括'root''key''library''isinit'等键的对象。
     * 
     * root为地图挂载根元素id，必填。
     * 
     * key为开发者key，必填。
     * 
     * library为一个字符串数组，指定附加库，选填。详见 {@link https://lbs.qq.com/webApi/javascriptGL/glGuide/glBasic}
     * 
     * isinit指定是否使用默认配置初始化地图，为布尔值，选填。默认false。
     * 
     * @param {string} options.root root为地图挂载根元素id，必填。
     * @param {string} options.key 开发者key，必填。
     * @param {Array<string>} options.library 附加库。选填。详见 {@link https://lbs.qq.com/webApi/javascriptGL/glGuide/glBasic}
     * @param {boolean} options.isinit 是否使用默认配置初始化地图，选填。默认false。
     */
    constructor({root,key,library=['visualization', 'tools', 'geometry', 'model', 'view', 'service'],isinit = false} = {}){
        (root || key) === undefined?error("地图挂载的根标签与开发者Key必需传入。","此时",{root,key}):debug("cuteTencentMap Class start constructing.",this)

        this.metaState = {
            key:key,
            root:root
        }

        // 启动
        this.#eventQueue = []
        this.#eventDelayTime = 1000
        this.#eventIntervalId = setInterval(
            this.#eventLoop.bind(this),1000
        )
        debug("EventLoop has been started")

        
        // 通过标签引入腾讯地图Javascript库
        let constructLibString = (oldstr, ...newstr) => newstr.length == 0 ? oldstr : oldstr + ',' + newstr

        if(document.getElementById(IMPORT_SCRIPT_ID) == null){
            let script = document.createElement("script")
            script.id = "TencentMapJsV1Import"
            script.type = "text/javascript"
            script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${key}&libraries=${constructLibString.apply(null, library)}`
            document.body.appendChild(script)
        }

        // 若指定执行默认的初始化设置，则将该初始化设置作为事件传入队列
        // 之所以不使用window.addEventListener进行监听，是因为在Single Page Application中，
        // 可能会出现页面已经完成资源加载但因为状态更改而导致的原本加载的资源丢失的问题发生
        // 虽然这种情况少见，但以防万一还是这样子了。
        let that = this

        if(isinit){
            function defaultMapSet(){
                debug("Default map set has been actived")
                that.map = new TMap.Map(root,{
                    center:new TMap.LatLng(30.412919, 111.75407),
                    zoom:11.23
                })

                that.map = that.map.__evaluate__()
                
                debug("Instance's map is:",that.map,typeof that.map,that.map.__literalmapcls__)
            }

            this.#eventQueue.push({
                evt:defaultMapSet,
                delay:500
            })
        }
   
    }

    /**
     * 添加一个需要执行的事件
     * @param {Function} fuc 执行事件逻辑的函数 
     * @param {Number} delay 延迟时间，单位为毫秒。
     */
    addEvent(fuc,hook,delay){
        this.#eventQueue.push({
            evt:fuc.bind(hook,delay),
            delay:delay
        })
    }
}