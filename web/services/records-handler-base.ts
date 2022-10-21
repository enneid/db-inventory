import { loaded, ServiceBase } from './service-base';
import { ConfigService } from "./config-service";
import { UrlProvider } from './url-provider';
import { RequestService } from "./request-service";
import { PersistentPromiseStatic } from "../libs/persistent-promise-static";
import { PromiseStatic } from "../libs/promise-static";
import { Subject } from 'rxjs';

export interface RecordBase {
    model_type: string
    id: string 
}

export class RecordHandlerBase<T extends RecordBase = RecordBase> extends ServiceBase {

    recordsemitter: Subject<T[]> = new Subject(); 
    records: T[]
    module: string
    type: string

    constructor(public config: ConfigService, public urls: UrlProvider, public requests: RequestService, init = true){
        super(false)
        this.waitfor.push(config, urls, requests)
        if(init) this.init()
    }

    protected load() {
        this.active = true
    }

   
    get active(){
        return this._active
    }

    set active(v){
        this._active = v
        this.runinterval()
    }

    filter: Object
    interval: number = 10000;
    

    

    forceReload(){

        clearTimeout(this._tm)
        let cancelpromise = new PromiseStatic
        let pr = this.fetchRecords({}, cancelpromise.Promise).then((records)=>{
            this.records = records;
            this.recordsemitter.next(records)
        })
        this.persistant.reinitialize(pr, cancelpromise)
        pr.finally(()=>{
            cancelpromise.reject("finally", "ignore")
            this._timestamp = Date.now() 
            this._running = false
            this.runinterval()
        })
        return pr;
    }

    protected runinterval(){
        if(this._running) return
        if(!this.active) return;
        this._running = true;
        let tm = Date.now() -this._timestamp  
        if(tm < this.interval){
            this._tm = setTimeout(()=>{
                if(this.active){
                    this._running = true;
                    this.forceReload()
                }
            }, this.interval - tm)
            return;
        }else{
            this.forceReload()
        }
    }
    

    @loaded
    fetchRecords(opts: Object = {}, cancel?: Promise<any>): Promise<T[]>{
        let uri = this.urls.getApiUri({module: this.module, resource: this.type, action: "index"}, opts)
        return this.requests.fetch(uri, {signal: <any>cancel})
    }
    
    @loaded
    fetchRecord(id: string, action="show", opts={}, cancel?: Promise<any> ): Promise<T>{
        let uri = this.urls.getApiUri({module: this.module, resource: this.type, action: action}, {id: id, ...opts})
        return this.requests.fetch(uri, {signal: <any>cancel})
    }

    

    teardown(): void {
        clearTimeout(this._tm)
        this.persistant.teardown()
        this.recordsemitter.complete()
        super.teardown
    }

    protected persistant =  new PersistentPromiseStatic()
    protected _active: boolean = false
    protected _tm
    protected _running =false
    protected _timestamp = 0
}