export class IDProvider {
    constructor(protected _prefix: string, protected _index: number =0) {

        this._prefix = this._prefix.length ?  this._prefix + "_" : this._prefix;
    }

    public getNextID(prefix?: string): string {
        this._index++;
        return  (prefix || this._prefix) + this._index.toString();
    }

    protected static _global: IDProvider

    public static getNextID(prefix?: string){
       if(!this._global) this._global = new this("")
        return this._global.getNextID(prefix)
    }
}

export class RandIDProvider extends IDProvider {
    public size: number  = -1;
    public getNextID(prefix?: string): string {
        let val  = (prefix || this._prefix) +this.randomVal(this.size);
        return val;
    }
    protected static _global: RandIDProvider = new RandIDProvider("")
    public static getNextID(prefix?: string){
        if(!this._global) this._global = new this("")
        return this._global.getNextID(prefix)
    }

    protected randomVal(sub?: number){
       let val =  (Math.random()).toString(36);
       if(sub == void 0 || sub < 0){
           return val.substr(2);
       }
       return val.substr(2, sub);
    }
}


export function TimestampId(rand_float=true){
    return rand_float ? Date.now()+Math.random() : Date.now();
}
