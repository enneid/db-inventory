import { inject, injectable, singleton } from 'tsyringe';
import { ServiceBase } from './service-base';
import { RequestService } from './request-service';
import { DeepValue } from '../libs/deep-value';
import { PromiseStatic } from "../libs/promise-static";
import { SimpleType, EvalSimpleValues } from "../libs/utils";

@singleton()
// @injectable()
export class ConfigService extends ServiceBase{
    constructor(public requests: RequestService){
        super(false);
        this.waitfor.push(requests)
        this.init()
    }

    load(){
        return this.requests.fetch("/config/config.json").then((c)=>this.config = c)
    }

   
    protected _loadedpromise = new PromiseStatic<Object>()
    config:  Object

    getConfig<T = any>(path: string, default_value?: T, simpletype?: SimpleType){
        if(!this.isloaded) throw new Error("not loaded")
        let val =  <T>DeepValue(this.config || {}, path)
        return <T>(val  == void 0 ? default_value : (eval ? EvalSimpleValues(simpletype, val) : val) );
    }

}

