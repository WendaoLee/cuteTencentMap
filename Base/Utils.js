import { createHook } from "./abstract/hook";
import { Thunk } from "./abstract/thunk";

function importTencentMap(
  key,
  library = ["visualization", "tools", "geometry", "model", "view", "service"]
) {


  
  let constructLibraries = (oldstr, ...newstr) => newstr.length == 0 ? oldstr : oldstr + ',' + newstr //即使传入为空也不会影响正常使用


  let that = this

  let isAPIScriptNotImport = (document.getElementById("TencentMapJsV1Import") == null)
  if (isAPIScriptNotImport) {
      
    import(/* webpackIgnore: true */ /* @vite-ignore */ `https://map.qq.com/api/gljs?v=1.exp&key=${key}&libraries=${constructLibraries.apply(null, library)}&callback=testtest`);
  }

  // createHook()
}

function createThunk(codeFn,...args){
  return new Thunk(codeFn,args)
}

export { importTencentMap as loadTencentMap,Thunk as Thunk,createThunk as createThunk};
