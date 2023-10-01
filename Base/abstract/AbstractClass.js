/**
 * 代表 ThunkProxy ，同时代表一个 Thunk 的 closure.contextFn 是一个构造函数,而不是普通函数。
 */
export class ThunkProxy {
  __type__ = "ThunkProxy";
}

export const symbolThunkProxy = new ThunkProxy();

export class ThunkSymbol {
  __type__ = "ThunkSymbol";
}

