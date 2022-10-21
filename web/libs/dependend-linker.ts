

import * as _ from "lodash"
import { RandIDProvider } from "./id-provider";


import { TeardownModel, teardownReturn, teardownThrow } from "./teardown-model";
import { SimpleModelData } from "./utils";

export interface LinkedContent<T=any> {cancel: ()=>void, refid: string, model: T, simple?: boolean}
export interface LinkedData extends LinkedContent {
    oncancel: (content: Partial<LinkedContent>) => void
}

export interface DependencyLinkerInterface {
    linkDependency(ref: Partial<LinkedData>|DependencyLinkerInterface, dependency?: Partial<LinkedData>,  dependent?: Partial<LinkedData>): { refid: string, cancel: ()=>void } 
    linkDependent(ref: Partial<LinkedData>|DependencyLinkerInterface, dependent?: Partial<LinkedData>, dependency?: Partial<LinkedData>): LinkedContent

    cancelDependency(...refid: string[])
    cancelDependent(...refid: string[])

    getDependency(refid: string): any
    getDependent(refid: string): any

    hasDependency(ref?: string): boolean
    hasDependent(ref?: string): boolean

    isSingleDependency(): boolean
    isSingleDependent(): boolean

    teardownDependents(): void
    teardownDependencies(): void
    id?: string
    linkercontext: {id?: string}

}

export function IsDependencyLinkerInterface(elem: any): elem is DependencyLinkerInterface{
    if(!_.isObject(elem)) return false;
    let funcs = ["linkDependency", "linkDependent", "cancelDependency", "cancelDependent"]
    for(let i=0; i<funcs.length; i++){
        if(!_.isFunction(elem[funcs[i]])) return false;
    }
    return true
}

export function dependent(target: DependentLinker, keyname: string){
    return Object.defineProperty( target, keyname, {
        set: function(v: DependencyLinkerInterface) {
            if(v == void 0){
                target.cancelDependent(keyname)
                return
            }
            if(!IsDependencyLinkerInterface(v)) throw new Error(`${keyname} need to implement DependencyLinkerInterface`)
            if(target.getDependent(keyname)) throw new Error(`${keyname} already set`)
            target.linkDependent(v, {refid: keyname});
        },

        get: function() {
            return target.getDependent(keyname)
        },
        enumerable: true,
        configurable: true
    });
}

export function dependency(target: DependentLinker, keyname: string){
    return Object.defineProperty( target, keyname, {
        set: function(v: DependencyLinkerInterface) {
            if(v == void 0){
                target.cancelDependency(keyname)
                return
            }
            if(!IsDependencyLinkerInterface(v)) throw new Error(`${keyname} need to implement DependencyLinkerInterface`)
            if(target.getDependency(keyname)) throw new Error(`${keyname} already set`)
            target.linkDependency(v, {refid: keyname});
        },

        get: function() {
            return target.getDependency(keyname)
        },
        enumerable: true,
        configurable: true
    });
}



export class DependentLinker extends  TeardownModel implements  DependencyLinkerInterface {
    protected _dependents: Record<string, LinkedContent> = {}
    protected _dependencies: Record<string, LinkedContent> = {}
    id: string = RandIDProvider.getNextID()
    linkercontext: any = this

    get Dependents(){
        let deps = {}
        _.each(this._dependents, (v, k)=>{
            deps[k] = v.model
        })
        return deps;
    }

    get Dependencies(){
        let deps = {}
        _.each(this._dependencies, (v, k)=>{
            deps[k] = v.model
        })
        return deps
    }

    emit: (ev:string, data: any)=>any = ()=>{}

    constructor(linkercontext?: any){
        super()
        this.linkercontext = linkercontext || this
    }

    getDependency(refid: string): any {
        if(this._dependencies[refid]) return this._dependencies[refid].model
    }

    getDependent(refid: string): any {
        if(this._dependents[refid]) return this._dependents[refid].model
    }

    hasDependency(refid?: string): boolean {
       if(refid) return !!this._dependencies[refid]
       return !_.isEmpty(this._dependencies)
    }

    hasDependent(refid?: string): boolean {
        if(refid) return !!this._dependents[refid]
        return !_.isEmpty(this._dependents)
    }

    isSingleDependency(): boolean {
        return _.keys(this._dependencies).length == 1;
    }

    isSingleDependent(): boolean {
        return _.keys(this._dependents).length == 1;
    }

    @teardownThrow()
    linkDependency(ref: Partial<LinkedData>|DependencyLinkerInterface, dependency?: Partial<LinkedData>,  dependent?: Partial<LinkedData>): { refid: string, cancel: ()=>void } {
        let dependecylinker: DependencyLinkerInterface = null
        if(ref == void 0 || IsDependencyLinkerInterface(ref)){
            dependecylinker = <any>ref;
            dependency = this.prepareLinkedData(dependency, dependecylinker)
            dependent = this.prepareLinkedData(dependent, <any>this)
        }else{
           // dependent = this.prepareLinkedData(dependency, <any>this) //dependent here is not used
            dependency = this.prepareLinkedData(ref, null)
            if(!dependency.cancel) throw new Error("cancel callback required")
        }
        if(this._dependencies[dependency.refid]) throw new Error("dependency already registered")
        let simplecancel = this.cancelDependencyCallback.bind(this, <any>dependency)

        if(dependecylinker){
            let data = dependecylinker.linkDependent(_.extend(dependent, {oncancel: simplecancel}));
            dependency.cancel = data.cancel
        }

        let oldcancel = dependency.cancel
        dependency.cancel = ()=>{
            simplecancel();
            oldcancel();
        }
        this._dependencies[dependency.refid] = <any>dependency;
        return {refid: dependency.refid, cancel: dependency.cancel};
    }

    @teardownThrow()
    linkDependent(ref: Partial<LinkedData>|DependencyLinkerInterface, dependent?: Partial<LinkedData>, dependency?: Partial<LinkedData>): LinkedContent {
        let dependentlinker: DependencyLinkerInterface = null
        if(ref == void 0  || IsDependencyLinkerInterface(ref)){
            dependentlinker = <any>ref;
            dependent = this.prepareLinkedData(dependent, dependentlinker)
            dependency = this.prepareLinkedData(dependency, <any>this)
            if(dependentlinker && dependentlinker.hasDependency(dependency.refid))  throw new Error("dependency already registered")
        }else{
            //dependency = this.prepareLinkedData(dependent, <any>this) //will be not used
            dependent = this.prepareLinkedData(ref, null)
        }
        let obj = {cancel: null, refid: dependent.refid, model: dependent.model, oncancel: dependent.oncancel, simple: dependent.simple}
        obj.cancel = this.cancelDependentCallback.bind(this, obj)
        this._dependents[dependent.refid] = obj
        this.afterLinkDependent({model: obj.model, refid: obj.refid})
        if(dependentlinker){
            let v = dependentlinker.linkDependency({cancel: obj.cancel, model: dependency.model, refid: dependency.refid, simple: dependency.simple });
                obj.cancel = v.cancel
        }
        return {cancel:  obj.cancel, refid: obj.refid, model: obj.model, simple: obj.simple}
    }

    private prepareLinkedData(dep?: Partial<LinkedData>, linker?: DependencyLinkerInterface, radnomizerefid?: boolean): LinkedData{
        dep = _.clone( dep || {})
        dep.simple = dep.simple !== false;
        dep.model = dep.model || linker?.linkercontext || linker
        if(dep.simple) dep.model = SimpleModelData(dep.model)
        dep.refid = dep.refid || ((radnomizerefid || !linker) ? RandIDProvider.getNextID() : linker.linkercontext?.id || linker.id)
        return <any>dep
    }

    private cancelDependencyCallback(dependency: LinkedData){
        if(this._dependencies[dependency.refid] === dependency){
            this._dependencies[dependency.refid] = null
            delete this._dependencies[dependency.refid]
        }
    }

    private cancelDependentCallback(obj: LinkedData){
        if(this._dependents && this._dependents[obj.refid] != obj) return;
        this._dependents[obj.refid] = null;
        let model = obj.model
        let oncancel = obj.oncancel
        let refid  = obj.refid
        delete this._dependents[obj.refid]
        if(oncancel) oncancel({model: model, refid: refid})

        this.afterCancelDependent({model: model, refid: refid})
    }

    protected afterCancelDependent(data: {refid: string, model: any}){
        
    }

    
    protected afterLinkDependent(data: {refid: string, model: any}){
        
    }



    teardownDependencies(): void {
        this.cancelDependency()
    }

    teardownDependents(): void {
        this.cancelDependent()
    }

    cancelDependency(...refid: string[]) {
        if(!refid.length) refid = _.keys(this._dependencies)
        _.each(refid, (refid)=>{
            if(this._dependencies[refid]){
                let elem = this._dependencies[refid]
                this._dependencies[refid] = null
                delete this._dependencies[refid]
                elem.cancel();
            }
        })
    }

    cancelDependent(...refids: string[]) {
        if(!refids.length) refids = _.keys(this._dependents)
        _.each(refids, (refid)=>{
            if(this._dependents[refid]){
                let elem = this._dependents[refid]
                elem.cancel();
                this._dependents[refid] = null;
                delete this._dependents[refid]
            }
        })
    }
    @teardownReturn()
    teardown(){
        this.teardownDependencies()
        this.teardownDependents()
        this.linkercontext = null
        super.teardown()
    }
}
