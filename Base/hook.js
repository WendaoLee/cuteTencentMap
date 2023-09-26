import {ref} from './ref'

/**
 * @namespace
 * @property {Array<ref.ref>} thunkQueue
 * @property {object} thunkMeta
 * @property {Function} addl
 * @property {Function} isEmpty
 */
export const thunkHook = {
    /**
     * @type {Array<ref.ref>}
     */
    thunkQueue:[],
    thunkMeta:{},
    /**
     * 在等待计算队列中添加一个Thunk
     * @param {Thunk} thunk - 需要计算的Thunk
     * @returns {ref.ref} 返回thunk的引用对象
     */
    add:function(thunk){
      this.thunkQueue.push(new ref(thunk).ref)
      this.thunkMeta[thunk.contextMetaIndex] = this.thunkQueue[this.thunkQueue.length - 1]
      return this.thunkMeta[thunk.contextMetaIndex]
    },
  
    /**
     * 等待计算队列是否为空。如果为空，返回true
     * @returns {boolean}
     */
    get isEmpty(){
      return this.thunkQueue.length == 0
    },

    get nextThunkMetaIndex(){
        return this.thunkQueue.length
    },
  
    getRef(thunkMetaIndex){
      return this.thunkMeta[thunkMetaIndex]
    },

    releaseRef(thunkMetaIndex){
        delete this.thunkMeta[thunkMetaIndex]
    },
 
    /**
     * 计算等待计算队列中的第一个Thunk
     */
    evaluate(){
      let thunkToBeEvaluated = this.thunkQueue.shift()
      thunkToBeEvaluated.ins = thunkToBeEvaluated.ins.closure()
    },

    
  }
  
  
  var thunkHookInterval = undefined
  var hookCreateInterval = undefined
  
  function hookCycle(sec){
    if(thunkHook.isEmpty&&sec != 1000){
      clearInterval(thunkHookInterval)
      thunkHookInterval = setInterval(hookCycle.bind(this,1000),1000)
      return
    }
  
    if(thunkHook.isEmpty){
      return
    }
  
    if(sec != 200){
      clearInterval(thunkHookInterval)
      thunkHookInterval = setInterval(hookCycle.bind(this,200),200)
      return
    }
  
    thunkHook.evaluate()
  }
  
  
  function startHook(){
    thunkHookInterval = setInterval(
      hookCycle.bind(this,1000),1000
    )
  }
  
export function createHook(){
    if(window.TMap == undefined){
        hookCreateInterval = setInterval(createHook,500)
        return
    }
    if(hookCreateInterval != undefined){
        clearInterval(hookCreateInterval)
    }
    startHook()
}
