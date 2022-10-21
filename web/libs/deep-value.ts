import { each, isArray, isObject } from "lodash";

export function DeepPick(obj: Object, keys: string[], separator?: string){
    separator = separator || ".";
    let result = {};
    for(let i = 0; i < keys.length; i++ ){
        let path = keys[i].split(separator);
        let param: any =obj;
        let resultparam: any = result;
        for(let j=0 ; j <path.length; j++){
            let k = path[j];
            param = param[k];
            if( param == void 0) break;
            let islast = j == path.length-1;
            if(islast){
                resultparam[k] = param;
                break
            }
            resultparam[k] = resultparam[k] || {};
            resultparam = resultparam[k]
        }
    }
    return result;
}

export function DeepValue(obj: Object, key: string, separator?: string){
    separator = separator || ".";
    let path = key.split(separator);
    let param: any =obj;
    for(let j=0 ; j <path.length; j++){
        let k = path[j];
        param = param[k];
        if( param == void 0) return null;
        let islast = j == path.length-1;
        if(islast){
            return param
        }
    }
}

export function SetDeepValue(obj: Object, value: any, key: string, separator?: string){
    separator = separator || ".";
    let path = key.split(separator);
    let param: any =obj;
    for(let j=0 ; j <path.length; j++){
        let k = path[j];
        if(j == path.length-1){
            param[k] = value
        }else{
            param[k] = param[k] || {};
            param = param[k]
        }
    }
    return obj;
}

export function HasDeepKeys(obj: Object, keys: string[]|string, mode?: "all"|"any", separator?: string){
    let keysarr = isArray(keys) ? keys : [keys];
    separator = separator || ".";
    mode = mode || "all";
    let v = true;
    for(let i = 0; i < keysarr.length; i++ ) {
        let val = DeepValue(obj, keysarr[i], separator) != void 0;
        if(val && mode == "any") return true;
        if(!val && mode == "all" ) return false;
        v = v && val;
    }
    return v;
}

export function ObjectToDeepKeys(obj: Object, maxdeep: number =10, prefix?: string, result?: Object, separator?: string): Object{
   
    separator = separator || ".";
    prefix = prefix || "";
    prefix  = prefix && !prefix.endsWith(separator) ? prefix + separator  : prefix;
    result = result || {};
    each(obj, (v, k) => {
        let key = prefix + k;
        if (isObject(v) && maxdeep != 0) return ObjectToDeepKeys(v,maxdeep-1, key, result);
        result[key] =v;
    });
    return result;
}
export function DeepKeysToObject(obj: {[keyname: string]: any}): Object {
    let out = {};
    let currval: any;
    for(let keyname  in obj){
        let path = keyname.split(".");
        let key = <any>path.pop();
        currval = out;
        for(let i=0; i<path.length; i++ ){
            let curkey = path[i];
            currval[curkey] = currval[curkey] || {};
            currval = currval[curkey];
        }
        currval[key] = obj[keyname];
    }

    return out;
}

