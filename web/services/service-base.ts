import { TeardownModel } from "../libs/teardown-model";
import { onceReturn } from "../libs/decorators";
import { PromiseStatic } from "../libs/promise-static";
import { map } from "lodash";
import { RandIDProvider } from "../libs/id-provider";


export function loaded(target: ServiceBase,  propertyKey: string | symbol, descriptor: PropertyDescriptor){
    const original = descriptor.value;
    descriptor.value = function (this: ServiceBase, ...args: any) {
        if(this.isloaded) return original.apply(this, args);       
        return this.loadstate.then(()=> original.apply(this, args))
    }
}

export class ServiceBase extends TeardownModel{  
    id:string = RandIDProvider.getNextID()  

    
    get loadpromise(){
        return this.loadstate.Promise
    }
    get isloaded(){
        return this.loadstate.Resolved
    }

    waitfor: (ServiceBase|Promise<any>)[] = []

    constructor(init=true){
        super()
        if(init) this.init()
    }

    @onceReturn()
    init(){
        let val = null
        if(this.waitfor && this.waitfor.length){
            let promises = map(this.waitfor, (load)=> load instanceof ServiceBase ? load.loadpromise : load)
            val = Promise.all(promises).then((e)=>this.load())
        }else{
            val = this.load()
        }
        if(val){
            this.loadstate.resolveWith(val, "ignore")
        }else{
            this.loadstate.resolve(null, "ignore")
        }
    }

    protected load():Promise<any>|void{}

    teardown(): void {
        this.loadstate.reject("teardown", "ignore")
        super.teardown()
    }
    
    protected loadstate =  new PromiseStatic()

    
}