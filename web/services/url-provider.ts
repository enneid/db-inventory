
import {  singleton } from "tsyringe";
import { ConfigService } from './config-service';
import { extend, isNumber, isString, omit } from "lodash";
import { EvalTemplateWithDependencies } from "../libs/templates";
import { ServiceBase } from "./service-base";
import { EvalSimpleValues } from "../libs/utils";


export type UriPath = string|{module: string, resource: string, action: string}
export type StringMap = Record<string, string>
export type UriParams ={url: string, method: string, params: Record<string, any>, options: {usecredentials?: boolean, corsmode?: RequestMode}}


interface UriRoot {
    port: number|string
    origin_url: string
    protocol: string
    action_url: string
    from_base: boolean
}


@singleton()
export class UrlProvider extends ServiceBase{
    
    constructor(public config: ConfigService) {
        super(false)
        this.waitfor.push(config)
        this.init()
    }

    protected load(){
        this._root = this.prepareRoot("api.root")
    }

    getApiUri(action: UriPath, params?: Object): UriParams{
        params = params || {};
        let [path, method, path_params] = this.determinePathTemplate(action)
        let [url, , used_keys] = EvalTemplateWithDependencies("action_url", extend({}, this._root, {path: path, method: method}, path_params), extend({},params));
        return {url: url, method: method, params: omit(params, used_keys), options: {
            usecredentials:this.config.getConfig("api.root.credentials", false, "boolean"), 
            corsmode: this.config.getConfig("api.root.corsmode", 'cors')
        }};
    }

    determinePathTemplate(action: UriPath): [string, string, Object]{
        if(typeof action=="string"){
            let path = this.config.getConfig<string>(`api.${action}_path`);
            let method = this.config.getConfig<string>(`api.${action}_method`);
            return [path, method, {}]
        }else{

            let md = `api.${action.module}`
            let module = this.config.getConfig<string>(`${md}.module`);
            if(!module) throw new Error(`url module ${action.module} not defined`)
            let re = `${md}.${action.resource}`
            let resource = this.config.getConfig<string>(`${re}.resource`);
            if(!resource) throw new Error(`url resource ${action.resource} not defined`)

            let crud_path: StringMap  =
                this.config.getConfig(`${re}.crud_path`) ||
                this.config.getConfig(`${md}.crud_path`) ||
                this.config.getConfig(`api.root.crud_path`)
            let crud: StringMap  =
                this.config.getConfig(`${re}.crud`) ||
                this.config.getConfig(`${md}.crud`) ||
                this.config.getConfig(`api.root.crud`)
            let path = this.config.getConfig<string>(`${re}.${action.action}_path`);
            let method = this.config.getConfig<string>(`${re}.${action.action}_method`);
            if(!path){
                path = crud[`${action.action}_path`]
                method = crud[`${action.action}_method`]
            }
            return [path, method, {module: action.module, resource: action.resource, crud_path: crud_path}]


        }
    }

    private prepareRoot(name: string, eval_origin = true){
        let root = extend({}, this.config.getConfig(name))
        if(isNumber(root["port"]) || (root["port"] && isString(root["port"]) && root["port"][0] != ":") ) root["port"] = ":"+root["port"];
        let ev = {}
        if(EvalSimpleValues("boolean",root["from_base"])){
            root["origin_url"] = location.origin;
        }else{
            EvalTemplateWithDependencies("origin_url", root, ev)
        }
        return extend({}, <UriRoot>root, ev)
    }

    private _root: UriRoot


}