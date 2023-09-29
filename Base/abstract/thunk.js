import { thunkHook } from "./hook";
import {ThunkProxy,ThunkSymbol,symbolThunkProxy} from './AbstractClass'

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
  contextCode;

  isEvaluated;
  evaluateValue;

  contextTarget
  contextMetaIndex
  contextRef

  closure;

  constructor(codeFn, ...args) {
    this.isEvaluated = false
    this.contextArg = args
    this.contextCode = codeFn
    this.eventQueue = []
    this.closure = () => {
      console.debug("closure invokes",this)
      let isThunkProxy = (args[args.length - 1] instanceof ThunkProxy)
      if(isThunkProxy){
        args.pop()
      }
      let i = 0
      for (let arg of args) {
        
        
        if (arg instanceof Thunk) {
          if(arg.isEvaluated){
            console.debug('arg is evaluated',arg.evaluateValue)
            console.debug('arg',arg)
            args[i] = arg.evaluateValue
            console.debug("changed args",args)
            i++
            continue
          }
          arg = evaluateArgThunk(arg.closure);
          i++
          continue
        }
        if(arg instanceof Object){
          for (const key in arg) {
            arg[key] = arg[key] instanceof Thunk?evaluateArgThunk(arg[key].closure):arg[key]
          }
          i++
        }
      }

      if(isThunkProxy){
        let cons = codeFn()
        this.contextTarget = new cons(...args);
        console.debug("value return",this.contextTarget)
        this.isEvaluated = true
        this.evaluateValue = this.contextTarget
        return this.contextTarget
      }

      console.debug("codeFn:",codeFn,"typeof",typeof codeFn)
      console.debug("codeFn()",codeFn())
      console.debug("args",args)
      this.contextTarget = codeFn()(...args);
      console.debug("value return",this.contextTarget)
      this.isEvaluated = true
      this.evaluateValue = this.contextTarget
      return this.contextTarget
    };

    this.contextMetaIndex = thunkHook.nextThunkMetaIndex
    thunkHook.add(this)
    this.contextRef = thunkHook.getRef(this.contextMetaIndex)
    return this
  }

}


