import { LazyPrototype } from "./lib/LazyPrototype.js"

/**
 * 针对 Literal 库 下的类进行求值的通用功能函数。
 * 
 * @expect 
 * let b = new TMap.LatLng(23,12)
 * evaluate(b)
 * 
 * 考虑有以下情况:
 * @example
 * that.map = new TMap.Map(root,{
                    center:new TMap.LatLng(30.412919, 111.75407),
                    zoom:11.23
                })
 * //此时应该
 * @param {Object} ob
 */
export function evaluate(...evalArg){
    
    for (let ob of evalArg) {
        if(LazyPrototype.prototype.isPrototypeOf(ob)){
            ob.__evaluate__(ob)
            continue
        }
        
        if(typeof ob == "function"){
            ob.__bind__(ob)
        }
    }
    
}

/**
 * 针对对象里可能存在着需要延迟求值的键值进行求值的功能函数。同样可对一个普通对象里包含着的 Literal 库中的类对象进行延迟求值。
 * 
 * 请注意，它将直接修改原对象。并且该特性只适用于传入的为普通的js对象，由构造函数构造的对象不在此列。
 * 
 * 请注意，它不适用于传入单个函数进行求值。
 * 
 * @example 
 * //传入普通js对象，其中有函数键值及需要求值的TMap.LatLng字面量类键值
 * ob = {a:function(){return 1},b:LatLng}
 * objectEvaluate(ob)
 * //当然，重新给ob赋值也是可以的 ob=objectEvaluate(ob)
 * @example //如果要对单个函数或由构造函数构造的对象进行求值
 * ob = ()=>{}
 * ob = objectEvaluate(ob)
 * ob = new TMap.LatLng(12,2)
 * ob = objectEvaluate(ob)
 * 
 * @param {Object} ob 传入的需要延迟求值的对象
 * @returns {Object} 已经求值的对象
 */
export function objectEvaluate(ob){
    
    if(typeof ob == "function"){
        return objectEvaluate(ob())
    }

    if(typeof ob == "object" && LazyPrototype.prototype.isPrototypeOf(ob)){
        console.log("ob:",ob)
        return ob.__evaluate__()
    }

    if(typeof ob == "object" && ob != null){
        for(let key in ob){
            ob[key] = objectEvaluate(ob[key])
        }
    }

    return ob
}