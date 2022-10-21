import { InvalidOperation } from "./exception";

type StaticPromiseState = "inprogress"|"resolved"|"rejected";

export interface ThenCatchInterface<R>{
    then: (result: (r: R) => any, error?: (e: any)=> any) => any
    catch: (reject: (e: any) => any) => any
}



export interface PromiseStaticLike<T> extends ThenCatchInterface<T> {
    reject: (reason?: any, policy?: "error"|"ignore") => void
    resolve: (result?: T, policy?: "error"|"ignore") => void
}

export class PromiseStatic<T = any> implements PromiseStaticLike<T>{
    public static resolve<T>(result: T): PromiseStatic<T>{
        let promise = new PromiseStatic<T>();
        promise.resolve(result);
        return promise;
    }

    public static reject<T>(reason: any): PromiseStatic<T>{
        let promise = new PromiseStatic<T>();
        promise.reject(reason);
        return promise;
    }

     public static all<T>(staticpromises: PromiseStatic<T>[], policy: "error"|"ignore" = "error"): PromiseStatic<T[]>{
        let promises: (Promise<T>)[] = [];
        for(let i=0; i<staticpromises.length; i++ ){
            promises.push(staticpromises[i].Promise)
        }
        return this.wrap<T[]>(Promise.all<T>(promises), policy)
    }

    public static wrap<T>(promise: Promise<T>, policy: "error"|"ignore" = "error"): PromiseStatic<T>{
        let all = new PromiseStatic<T>();
        promise.then((result: T) => {all.resolve(result, policy)}, (reason) => {all.reject(reason, policy)});
        return all;
    }



    public constructor() {
        this._promise = new Promise<T>((resolve: (result: T) => void, reject: (reason?: any) => void): void => {
            this._state = "inprogress";
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public resolveWith(promise: Promise<T>, policy: "error"|"ignore" = "error"){
        promise.then((r)=>{
            if(!this.Finished) this.resolve(r, policy);
        }).catch((e)=>{
            if(!this.Finished) this.reject(e, policy);
        })
    }

    public then(onresolve: (r: T) => any, onreject?: (e) => any){
        return this.Promise.then(onresolve, onreject)
    }

    public catch( onreject?: (e) => any){
        return this.Promise.catch(onreject)
    }
    
    public resolve(result?: T, policy: "error"|"ignore" = "error") {
        if (this.Finished){
            if (policy == "error")  throw new InvalidOperation
            return
        }

        if (result === undefined) {
            result = null;
        }
        this._state = "resolved";
        this._resolve(result);
        this._resolve = null;
        this._reject = null;
    }

    public reject(reason?: any, policy: "error"|"ignore" = "error") {
        if (this.Finished){
            if (policy == "error")  throw new InvalidOperation
            return
        }

        this._state = "rejected";
        this._reason = reason;
        this._reject(reason);
        this._resolve = null;
        this._reject = null;
    }

    public get Finished(): boolean {
        return this._state != "inprogress";
    }

    public get Rejected(): boolean {
        return this._state == "rejected";
    }

    public get Resolved(): boolean {
        return this._state == "resolved";
    }

    public get Promise(): Promise<T> {
        return this._promise;
    }

    public get Reason(): any {
        return this._reason;
    }

    private _state: StaticPromiseState = null;
    private _promise: Promise<T> = null;
    private _reason: any = null;
    private _resolve: (value: T) => void = null;
    private _reject: (reason?: any) => void = null;
}
