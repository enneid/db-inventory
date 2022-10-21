import { PromiseStatic } from "./promise-static"
import { TeardownModel, teardownReturn } from "./teardown-model"


export class PersistentPromiseStatic<T> extends TeardownModel{


    get Promise(){
        //@teardownReturn not works
        //Invalid property descriptor. Cannot both specify accessors and a value or writable attribute
        if(this.isteardown) return Promise.reject("teardown")
        if(!this.external){
            this.external = new PromiseStatic()
        }
        return this.external.Promise
    }

    @teardownReturn(()=> Promise.reject("teardown"), true)
    reinitialize(prom: Promise<T>|PromiseStatic<T> = new PromiseStatic(), cancel?: (()=>any)|PromiseStatic){
        this.cancelInternal(new Error("reinitialize"))
        let cl  = cancel && cancel instanceof PromiseStatic ? ()=>cancel.reject("cancel", "ignore") : cancel
        if(!this.external || this.external.Finished)  this.external = new PromiseStatic()
        let pr = this.internal =   prom instanceof Promise ? PromiseStatic.wrap(prom, "ignore") : prom
        pr.Promise.then((v)=>{
            if(pr !== this.internal) return
            this.internal = null
            this.internalcancel = null
            this.external.resolve(v)
        }, (e)=>{
            if(pr !== this.internal) return
            this.internal = null
            this.internalcancel = null
            this.external.reject(e)
        })
        this.internalcancel = <any>cl
        return pr;
    }

    @teardownReturn()
    reject(e: any){
        this.cancelInternal(e)
        this.Promise
        if(this.Initialized) this.external.reject(e, "ignore")
    }

    @teardownReturn()
    resolve(a: T){
        this.cancelInternal(a)
        this.Promise
        if(this.Initialized) this.external.resolve(a, "ignore")
    }

    get Finished(){
        //@teardownReturn not works
        //Invalid property descriptor. Cannot both specify accessors and a value or writable attribute
        if(this.isteardown) return true
        return this.external && this.external.Finished
    }

    get Initialized(){
        return !!this.external
    }

    teardown() {
        if(this.external) {
            this.external.reject("teardown", "ignore")
            this.external = null;
        }
        this.cancelInternal()
        super.teardown();
    }

    private external: PromiseStatic<T>
    private internal: PromiseStatic<T>
    private internalcancel: ()=>any

    private cancelInternal(reason?: any){
        if(!this.internal) return;
        let internal =  this.internal;
        let cancel = this.internalcancel
        this.internal = null
        this.internalcancel = null
        if(cancel) cancel();
        internal.reject(reason, "ignore")
    }
}