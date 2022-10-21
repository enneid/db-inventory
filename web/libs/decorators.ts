import { prepareErrorConstructor } from "./utils";

export function onceReturn(val = void 0 ): MethodDecorator{
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;
        const caller = "__once"+<any>propertyKey
        const callervalue = "__once"+<any>propertyKey+"Value"
        descriptor.value = function (this, ...args: any) {
            if(this[caller]) return this[callervalue]
            this[caller] = true
            let r =  original.apply(this, args);
            this[callervalue] = val != void 0 ? val : r
            return r
        }
    }
}


export function onceThrow(error: {new(message): Error}|string=void 0, message: string = void 0): MethodDecorator{
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;
        const caller = "__once"+<any>propertyKey
        const [ErrorConstructor, m] = prepareErrorConstructor(error, message || `method ${propertyKey.toString()}  already called`)
        descriptor.value = function (this, ...args: any) {
            if(this[caller]) throw new ErrorConstructor(m)
            this[caller] = true
            return original.apply(this, args);
        }
    }
}

export function singleThrow(error: {new(message): Error}|string=void 0, message: string = void 0){
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor)=>{

        const original = descriptor.value;
        const caller = "__running"+<any>propertyKey
        const [ErrorConstructor, m] = prepareErrorConstructor(error, message || `method ${propertyKey.toString()}  already called`)
        descriptor.value = function (this, ...args: any) {
            if(this[caller]) throw new ErrorConstructor(m)
            this[caller] = true
            try {
                return original.apply(this, args);
            } finally {
                delete this[caller];
            }

        }
    }
}




export function singleRun(val:any=null){
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor)=>{

            const original = descriptor.value;
            const caller = "__running"+<any>propertyKey
            descriptor.value = function (this, ...args: any) {
                if(this[caller]) return (typeof val == "function") ? val() :val
                this[caller] = true
                try {
                    return original.apply(this, args);
                } finally {
                    delete this[caller];
                }

        }
    }
}

export function debounce(opts: Partial<{interval: number, firstasync: boolean}> = {}){
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor)=>{

        const original = descriptor.value;
        const caller = "__debounce"+<any>propertyKey
        const caller_waiting = "__debounce_waiting"+<any>propertyKey
        descriptor.value = function (this, ...args: any) {
            try {
                if(this[caller] != void 0){
                    this[caller_waiting] = true
                    return;
                }
                if(opts.firstasync){
                    this[caller_waiting] = true
                }else{
                    original.call(this)
                }
                this[caller] = setTimeout(()=>{
                    try {
                        if(this[caller_waiting]){
                            original.call(this)
                        }
                    }finally {
                        delete this[caller]
                        delete this[caller_waiting]
                    }
                }, opts.interval || 50)
            } finally {
                delete this[caller];
                delete this[caller_waiting]
            }

    }
}
}