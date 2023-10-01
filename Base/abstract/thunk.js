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

export class Thunk {
  contextArg;
  contextFn;

  isEvaluated;
  evaluateValue;

  contextTarget
  contextMetaIndex

  closure;

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
        args.pop() //剔除多余参数以避免影响闭包中的函数的执行结果
      }

      let i = 0
      for (let arg of args) {      
        if (arg instanceof Thunk) {
          if(arg.isEvaluated){
            debug(`Arg is evaluated,for arg in args[${i}]`,arg.evaluateValue)
            debug('And arg is',arg)
            args[i] = arg.evaluateValue.val
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


