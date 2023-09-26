import { thunkHook } from "./hook";

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

class Thunk {
  contextArg;
  contextCode;

  contextTarget
  contextMetaIndex

  closure;

  constructor(codeFn, ...args) {
    this.eventQueue = []
    this.closure = () => {
      for (const arg of args) {
        if (arg instanceof Thunk) {
          arg = evaluateArgThunk(arg.closure);
          continue
        }
        if(arg instanceof Object){
          for (const key in arg) {
            arg[key] = arg[key] instanceof Thunk?evaluateArgThunk(arg[key].closure):arg[key]
          }
        }
      }
      this.contextTarget = codeFn()(...args);
      return this.contextTarget
    };

    this.contextMetaIndex = thunkHook.nextThunkMetaIndex
    thunkHook.add(this)
    return this
  }

}


