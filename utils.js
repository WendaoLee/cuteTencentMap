/**
 * 引入腾讯地图JavascriptAPI。
 * 这是一个功能函数，主要解决的是重复引入API资源以及API资源销毁问题（若把TencentMap放在组件中加载，那么组件的销毁与切换可能会造成该问题）。
 * 如要使用该函数，请确保引入它的位置是一个全局位置。
 * - 如果您使用的是Vue，建议将它导入main.js使用。
 * @param {string} thekey - 开发Key。
 * @param {Array[string]} library - 需要引入的附加库，为一个字面量数组，如['geometry']。如果不指定，会引入所有附加库。
 */
 export function importTencentResources(theKey, library=['visualization','tools','geometry','model','view','service']) {
    let constructLibraries = (oldstr, ...newstr) => newstr.length == 0 ? oldstr : oldstr + ',' + newstr //即使传入为空也不会影响正常使用
    
    let script = document.createElement("script")
    script.id = "TencentMapJsV1Import"
    script.type = "text/javascript"
    script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${theKey}&libraries=${constructLibraries.apply(null, library)}`
    document.body.appendChild(script)
}

/**
 * 检查页面资源是否全部加载完毕。
 * - 您可以通过它判断腾讯地图api是否完全加载。
 * @returns 
 */
export function isResourcesLoaded(){
    return document.readyState == "complete"
}

// export function getTMapConstraint(val){
//     return new Promise(function(resolve,reject){
//         if(window.TMap == undefined){
//             reject(val)
//         }else{
//             resolve(val)
//         }
//     }).then(function(val){
//         return val == "default"?window.TMap.constants.MAP_ZOOM_TYPE.DEFAULT:window.TMap.constants.MAP_ZOOM_TYPE.CENTER
//     },function(val){
//         getTMapConstraint(val)
//     })
// }

export function LazyEvaluation(fn,...context){
    return fn.bind(null,...context)
}


export function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

export function functional_evaluation(ob){
    if(typeof ob == 'function'){
        return functional_evaluation(ob())
    }
    if(typeof ob == 'object' && ob != null){
        for(let key in ob){
            ob[key] = functional_evaluation(ob[key])
        }
    }
    return ob
}