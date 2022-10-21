


import { map } from "lodash";
export type SimpleType = "number"|"float"|"string"|"boolean"|"object"|"any"
export function EvalSimpleValues<T =any>(simpletype: SimpleType, val: any){
    if(val == void 0) return <T>val;
    if(simpletype == 'number') val = parseInt(<string>val);
    if(simpletype == 'float') val = parseFloat(<string>val);
    if(simpletype == 'string') val = val.toString();
    if(simpletype == 'boolean'){
        if(typeof val == 'boolean') val = val;
        val = ["1", "true", "True", "T", "t"].indexOf(""+val) == -1 ? false : true;
    }
    if(simpletype == 'object'){
        if(typeof val == "object") return val;
        return <T>JSON.parse(""+val);
    }
    return <T>val;
}

export function SimpleModelData(obj: any){
    if(obj == void 0) return {id: null, classname: ClassName(obj)}
    return {id: ClassIdentifier(obj), classname: ClassName(obj)}
}

export function ClassIdentifier(obj: any){
    if(obj == void 0) return ""+obj;
    let tp = typeof obj;
    if(tp != 'object') return tp;
    if(obj["getid"]) return obj["getid"]()
    return obj["id"]
}

export function ClassName(obj: any){
    if(obj == void 0) return ""+obj;
    let tp = typeof obj;
    if(tp != 'object') return tp;
    if(obj['classname']) return obj['classname']
    return obj['constructor']['name'];
}


export function ConstructorChain(Constructor: any, RootContructor?:any, cachekey?: string ): any[]{
    let arr = [];
    if(!Constructor) return [];
    if(cachekey && Constructor[cachekey]) return Constructor[cachekey]
    let org = Constructor;
    while(Constructor){
        arr.push(Constructor)
        if(RootContructor && Constructor === RootContructor) break;
        Constructor = Constructor.__proto__
    }
    if(cachekey) org[cachekey] = arr
    return arr;
}

export function Clamp(val: number, min: number, max: number){
    return Math.max(min, Math.min(val, max));
}


export function ParseObject(obj: any, reviver: (key: any, value: any)=>any){

    if(typeof obj == "object" && obj != void 0 ) {
        let parsekey = '___parseflag';
        let neval: any;
        if(obj[parsekey]) throw new Error("circular dependecies");
        try {
            obj[parsekey] = true;
            if (obj instanceof Array) {
                neval = new Array(obj.length);
                for (let i = 0; i < obj.length; i++) {
                    neval[i] = ParseObject(obj[i], reviver)
                }
            } else {
                neval = {};
                for (let key in obj) {
                    if (key == parsekey) continue;
                    let val = reviver(key, obj[key]);
                    if(val &&  val instanceof Object && (val.constructor === Object || val.constructor == Array) ) {
                        val = ParseObject(val, reviver)
                    }
                    neval[key] = val;
                }
            }
            delete obj[parsekey]
        }catch(e){
            delete obj[parsekey];
            throw e;
        }

        return neval;
    }

    return obj;
}


export function JSONStringifySorted(val: any, replacer?: (key: string, value: any) => any): string {
    if ((val) && (typeof val === 'object')) {
        const keys = Object.keys(val);
        const len = keys.length;
        const res: string[] = new Array<string>(len);

        keys.sort();
        for (let i = 0; i < len; i++) {
            const key = keys[i];
            let v = val[key];

            if (replacer) {
                v = replacer(key, v);
            }
            res[i] = `${JSON.stringify(key)}:${JSONStringifySorted(v, replacer)}`;
        }
        return `{${res.join(',')}}`;
    } else if (val instanceof Array) {
        const arr = map(val, (v, i) => JSONStringifySorted(replacer ? replacer('' + i, v) : v, replacer));

        return `[${arr.join(',')}]`;
    } else {
        return JSON.stringify(val, replacer);
    }
}


export function DelayPromise(timeout: number = 10, val: any = void 0, err= void 0){
    return new Promise((r, e)=>{
        setTimeout( ()=>{
            if(err != void 0) e(err)
            r(val)
        }, timeout)
    })
}



export function TrackModelId(index: number, model: {id: string, model_type: string}){
    return `${model.model_type}-${model.id}`;
}


export function prepareErrorConstructor(error: ({new(message: any): Error}|string)=void 0, message: string): [{new(message: any): Error}, string] {
    let ErrorConstructor: {new(message: any): Error}
    if(error == void 0) return [Error, message];
    if(typeof error == "string"){
        message = error
        ErrorConstructor = Error
    }else{
        ErrorConstructor = error
    }
    return [ErrorConstructor, message]
    // if(!message) message = `calling ${propertyKey.toString()} on torn down model`
}

export function QueryParams(params: Record<string, any>){
    return (new URLSearchParams(params)).toString()
}

