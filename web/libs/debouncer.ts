import { TeardownModel } from "./teardown-model";


export class Debouncer extends TeardownModel{

    constructor(public callback: {(...args: any[]): any}, public timeout: number = 100, public timeoutfirstcall: boolean = false){
        super()
        this.lastcall =  Date.now();
        this._staticexec = ()=>{this.exec()};
    }

    public rundebouce: boolean = true;
    public timeoutid:  any;
    public lastcall: number;

    public exec(){
        this.lastcall =  <number>Date.now();
        if(this.timeoutid) clearTimeout(this.timeoutid);
        this.timeoutid = null;
        this.callback();
    }

    public teardown(){
        if(this.timeoutid) clearTimeout(this.timeoutid);
        this.callback = null
        this.timeoutid = null;
        super.teardown()
    }


    public schedule(){
        if(this.timeoutid) return
        let currtimeout = this.timeout - (Date.now()-this.lastcall);
        this.timeoutid = setTimeout(this._staticexec, currtimeout);
    }


    public debounce(force?: boolean){
        if(force || !this.rundebouce ) return this._staticexec();
        let now = <number>Date.now();
        if(this.lastcall + this.timeout <= now && !this.timeoutfirstcall) return this._staticexec();
        this.schedule()
    }

    private _staticexec: ()=>void;


    static debounce(id:string, callback, opts?: {timeout: number, timeoutfirstcall?: boolean}, force?: boolean){
        if(!this.annonymousedeb[id]) {
            opts = opts || {timeout: 100, timeoutfirstcall: false}
            let deb = new Debouncer(callback, opts.timeout)
            deb.timeoutfirstcall = opts.timeoutfirstcall;
            this.annonymousedeb[id] =deb;
        }
        return this.annonymousedeb[id].debounce(force);
    }

    static teardown(id: string){
        if(!this.annonymousedeb[id]) return
        this.annonymousedeb[id].teardown()
        this.annonymousedeb[id] = null
        delete this.annonymousedeb[id]
    }

    private static annonymousedeb: {[key:string]: Debouncer} =  {}
}
