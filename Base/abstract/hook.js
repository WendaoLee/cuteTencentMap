import { ref } from "./ref";
import { Thunk } from "./thunk";
/**
 * @namespace
 * @property {Array<ref.ref>} thunkQueue
 * @property {object} thunkMeta
 * @property {Function} addl
 * @property {Function} isEmpty
 */
export const thunkHook = {
  /**
   * @typedef ThunkToBeEvaluated
   * @property {ref.ref} ref 获取包括thunk的引用容器。当thunk计算完毕后，该引用的.ins属性会被修改为thunk的计算结果。
   * @property {number} index thunk在队列中的标号。用于计算完毕后的清除thunkMeta对该thunk的指向，以使得JS可以自动GC。
   */
  /**
   * 等待计算队列。队列中的每一项都是一个ThunkToBeEvaluated对象。
   * @type {Array<ThunkToBeEvaluated>}
   */
  thunkQueue: [],
  thunkMeta: {},
  /**
   * 在等待计算队列中添加一个Thunk
   * @param {Thunk} thunk - 需要计算的Thunk
   * @returns {ref.ref} 返回thunk的引用对象
   */
  add: function (thunk) {
    this.thunkQueue.push({
      ref: new ref(thunk).ref,
      index: thunk.contextMetaIndex,
    });
    this.thunkMeta[thunk.contextMetaIndex] =
      this.thunkQueue[this.thunkQueue.length - 1].ref;
    return this.thunkMeta[thunk.contextMetaIndex];
  },

  /**
   * 等待计算队列是否为空。如果为空，返回true
   * @returns {boolean}
   */
  get isEmpty() {
    return this.thunkQueue.length == 0;
  },

  get nextThunkMetaIndex() {
    return this.thunkQueue.length;
  },

  getRef(thunkMetaIndex) {
    return this.thunkMeta[thunkMetaIndex];
  },

  releaseRef(thunkMetaIndex) {
    delete this.thunkMeta[thunkMetaIndex];
  },

  /**
   * 计算等待计算队列中的第一个Thunk
   */
  evaluate() {
    let thunkToBeEvaluated = this.thunkQueue.shift();
    console.log(thunkToBeEvaluated)
    thunkToBeEvaluated.ref.ins = thunkToBeEvaluated.ref.ins.closure();
    delete this.thunkMeta[thunkToBeEvaluated.index]
  },
};

var thunkHookInterval = undefined;
var hookCreateInterval = undefined;

function hookCycle(sec) {
  if (thunkHook.isEmpty && sec != 1000) {
    clearInterval(thunkHookInterval);
    thunkHookInterval = setInterval(hookCycle.bind(this, 1000), 1000);
    return;
  }

  if (thunkHook.isEmpty) {
    return;
  }

  if (sec != 200) {
    clearInterval(thunkHookInterval);
    thunkHookInterval = setInterval(hookCycle.bind(this, 200), 200);
    return;
  }

  thunkHook.evaluate();
}

function startHook() {
  thunkHookInterval = setInterval(hookCycle.bind(this, 1000), 1000);
}

export function createHook() {
  
  if (window.TMap == undefined || window.TMap.hasOwnProperty('__load')) {
    hookCreateInterval = setInterval(createHook, 500);
    return;
  }
  if (hookCreateInterval != undefined) {
    clearInterval(hookCreateInterval);
  }
  startHook();
}
