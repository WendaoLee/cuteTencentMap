import { thunkHook } from "./hook";
import {ThunkProxy,ThunkSymbol,symbolThunkProxy} from './AbstractClass'
import {debug} from './logger.js'

/**
 * 对Thunk进行求值
 * @param {Thunk} thunk 
 * @returns 
 */
function evaluate(thunk){
  return thunk.closure()
}


function evaluateArgThunk(thunkFn) {
  return thunkFn();
}

export function createThunk(){
  return new Thunk()
}

/**
 * Thunk 代表一些计算。通过传递代表操作的 codeFn 参数（为一个函数）
 */
export class Thunk {
  contextArg;
  contextFn;

  /**
   * 代表该Thunk是否被计算了
   */
  isEvaluated;
  /**
   * 代表Thunk的计算结果。目前和contextTarget共享同个对象。
   * @todo 也许未来会将该项变更为计算结果的纯净值
   */
  evaluateValue;

  /**
   * 代表Thunk计算的结果。
   */
  contextTarget
  contextMetaIndex

  closure;

  #getPure(val){
    const pure_type = ['symbol','number','string','boolean','undefined']
    if (pure_type.includes(typeof val)){
      return val
    }
    if(val=== null){
      return null
    }
    return Object.assign({},val)
  }

  get val(){
    return this.#getPure(this.evaluateValue)
  }

  /**
   * 构造Thunk。
   * @param {Function} codeFn 该Thunk所代表的操作。
   * @param  {...any} args 如果 codeFn 为一个构造函数，需要在剩余参数的尾部添加 ThunkProxy 实例。
   * @returns {Thunk}
   */
  constructor(codeFn, ...args) {
    this.isEvaluated = false

    this.contextArg = args
    this.contextFn = codeFn


    this.contextTarget = {
      result:undefined
    }

    this.closure = () => {
      debug("closure invokes",this)

      //闭包中的函数如果是构造函数，需要使用 new 运算符。因此有这里的特殊处理
      //通过添加多余的 ThunkProxy 实例标识闭包中的函数为构造函数，而不是普通函数。这样可以正确返回结果值。
      let isThunkProxy = (args[args.length - 1] instanceof ThunkProxy)
      if(isThunkProxy){
        debug("is a ThunkProxy",args[args.length - 1])
        args.pop() //剔除多余参数以避免影响闭包中的函数的执行结果
      }

      let i = 0
      for (let arg of args) {      
        if (arg instanceof Thunk) {
          if(arg.isEvaluated){
            debug(`Arg is evaluated,for arg in args[${i}]`,arg.contextTarget)
            debug('And arg is',arg)
            args[i] = arg.contextTarget.result
            console.debug("changed args",args)
            i++
            continue
          }
          arg = evaluateArgThunk(arg.closure);
          i++
          continue
        }
        //对象中可能有 Thunk
        if(arg instanceof Object){
          for (const key in arg) {
            args[i][key] = args[i][key] instanceof Thunk?evaluateArgThunk(args[i][key].closure):args[i][key]
          }
          i++
          continue
        }
        i++
      }

      if(isThunkProxy){
        let cons = codeFn()
        this.contextTarget.result = new cons(...args);
        debug("contextFn is a constructor,constructor result:",this.contextTarget)
        this.isEvaluated = true
        this.evaluateValue = this.contextTarget
        return this.contextTarget
      }

      debug("codeFn()",codeFn())
      debug("args",args)
      this.contextTarget.result = codeFn()(...args);
      debug("Function value return",this.contextTarget)
      this.isEvaluated = true
      this.evaluateValue = this.contextTarget
      return this.contextTarget
    };

    this.contextMetaIndex = thunkHook.nextThunkMetaIndex
    thunkHook.add(this)
    // this.contextRef = thunkHook.getRef(this.contextMetaIndex)
    return this
  }

}


