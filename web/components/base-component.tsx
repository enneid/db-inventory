import React, { ReactNode } from "react";
import { DependencyContainer } from "tsyringe";
import { Registry } from "../registry";
import { each, extend, fromPairs, isFunction, keys } from "lodash";
import { Subscribable, Subscription, Unsubscribable } from "rxjs";
import { PromiseStatic } from "../libs/promise-static";

// export class ServiceContainer {
//     context: DependencyContainer
// }

export type Cancellable = {cancel: ()=>any}
export type CancellableLike = ()=>any|Cancellable|Unsubscribable|PromiseStatic

export function unifyCancellable(cn: CancellableLike): Cancellable&{target: CancellableLike}{
  let obj = {cancel: null, target:  cn}
  let clean  = ()=> {obj.target = null; obj.cancel = (()=>{}); }
  if("unsubscribe" in cn) return extend(obj, {cancel: ()=> {clean(); (cn as any).unsubscribe()} })
  if(cn instanceof PromiseStatic) return extend(obj, {cancel: ()=> {clean(); cn.reject("cancel", "ignore") } })
  if(isFunction(cn)) return extend(obj, {cancel: ()=> {clean(); cn() } })
  return extend(obj, {cancel: ()=> {clean(); (cn as any).cancel() } })
}

export function state<T extends BaseComponent>(target: T, keyname: string){
  return Object.defineProperty( target, keyname, {
    set: function(this: T, v: any) {
        this.setState(fromPairs([[keyname, v]]))
    },

    get: function(this: T) {
        return ((this.syncstate as any) || {})[keyname];
    },
    enumerable: true,
    configurable: true
});

}



export abstract class BaseComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  static contextType = Registry


  get depregister(){
    return (this.context as DependencyContainer)
  }
  servicesloaded: boolean
  constructed= false
  mounted: boolean
  protected syncstate: Object

  constructor(props: P){
    super(props)
    
    this.constructed = true
    this.syncstate = this.syncstate || {}
  }

  componentDidMount(){
    this.mounted = true
  }

  componenentWillUnmount(){
      this.mounted = false
  }

  state = ({} as S)

  initData(){

  }

  render(){
    if(!this.servicesloaded){
      // console.log("CONTEXT", this.context)
       this.prepareServices()
    }
    this.servicesloaded = true
    return this.draw(this.props, this.state)
  }

  abstract draw(props: Object, state: Object): ReactNode 

  
  setState<K extends keyof S>(state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),callback?: () => void): void{
    this.syncstate = this.syncstate || {}
    if( isFunction(state)){
        let oldcallback =callback || (()=>{});
        callback = ()=>{
          extend(this.syncstate, this.state || {});
          oldcallback();
        }
    }else{
        extend(this.syncstate, state)
    }
    if(this.mounted){
      return super.setState(state, callback)
    }else{
      if(isFunction(state)) throw new Error("setState with callabable argument can't be called before constructed")
      extend(this.state, state)
    }
  }

  subscribe<R>(sub: Subscribable<R>, callback: (r: R)=>any, scope?: string, reset: boolean = false){
    return this.bind((sub as any).subscribe(callback), scope, reset)
  }


  bind(sub: CancellableLike, scope?: string , reset?: boolean){
    let cancellable = unifyCancellable(sub)
    reset =  reset == void 0 ? (scope ==  void 0 ? false : true) : reset
    scope = scope || "general"
    if(reset) this.unbind(scope)
    let v = this.cancellables[scope] || []
    v.push(cancellable)
    this.cancellables[scope] = v;
    return sub;
  }

  unbind(scope?: string){
    let scopes = scope ? [scope] : keys(this.cancellables)
    each(scopes, (sc)=>{
      let set: Cancellable[] = this.cancellables[sc] || []
      each(set, (c)=>{c.cancel()})
      this.cancellables[sc] = null
      delete this.cancellables[sc]
    })
  }

  cancellables: Record<string, Cancellable[]> = {}
  
  
  protected prepareServices(){
   
    // this.services = (this.context as DependencyContainer).resolve(cast(this.constructor).serviceContainer)
  }
}

export function cast<T= any>(r: any){ return r}