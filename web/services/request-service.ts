import { isObject } from "lodash";
import { singleton } from 'tsyringe';
import { PromiseStatic } from '../libs/promise-static';
import { QueryParams } from "../libs/utils";
import { ServiceBase } from './service-base';
import { UriParams } from "./url-provider";

type AbortType = AbortSignal|Promise<any>|PromiseStatic<any>


// export function PostData(){
//     {
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: 'same-origin', // include, *same-origin, omit
//         headers: {
//           'Content-Type': 'application/json'
//           // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         redirect: 'follow', // manual, *follow, error
//         referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//         body: JSON.stringify(data) // body data type must match "Content-Type" header
//       });
// }

@singleton()
export class RequestService extends ServiceBase{

    fetch<T= any>(uri: string|UriParams, config: Partial<RequestInit&{signal: AbortType}> = {}): Promise<T>{
        let [url, conf] = this.prepareParams(uri, config)
        return fetch(url, <RequestInit>conf).then((response)=> response.json())
    }

    protected prepareParams(uri: string|UriParams, config: Partial<RequestInit&{signal: AbortType}> ) :  [string, RequestInit]{
        this.prepareAbortSignal(<any>config, config.signal);
        let url = null
        if(isObject(uri)){
            config.method = uri.method.toLowerCase()
            url = uri.url
            if(config.method != "get"){
                config.headers = {
                    'Content-Type': 'application/json',
                    ...(config.headers || {})
                }
                config.body = JSON.stringify(uri.params)
            }else{
                let params = QueryParams(uri.params)
                url = `${url}${params ? "?" : "" }${params}` 
            }
            config.credentials = "omit"
            config.mode = uri.options.corsmode || "cors"
            config.redirect = "follow"
        }else{
            url = uri
        }
        return [url, config]
    }

    protected prepareAbortSignal(config: RequestInit, signal: AbortType){
        if(signal ==  void 0) return;
        if(signal instanceof AbortSignal){
            config.signal = signal;
            return;
        }
        let promise = (signal instanceof Promise) ? signal : signal.Promise
        const controller = new AbortController();
        promise.then((v)=>controller.abort(v), (e)=>controller.abort(e) )
        config.signal =  controller.signal;   
    }
}