import { prepareErrorConstructor } from "./utils";

export class TeardownModel {
    isteardown: boolean;
    teardown(){
        this.isteardown = true
    }
}

export function teardownReturn(teardownreturn: any = void 0, callbablereturn = false): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = function (this: TeardownModel, ...args: any) {
            if(this.isteardown) return callbablereturn ? teardownreturn() : teardownreturn
            return original.apply(this, args);
        }
    }
}

export function teardownThrow(error: {new(message: any): Error}|string|undefined=void 0, message?: string): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;
        let [ErrorConstructor, m] = prepareErrorConstructor(error, message || `calling ${propertyKey.toString()} on torn down model`)
        descriptor.value = function (this: TeardownModel, ...args: any) {
            if(this.isteardown) throw new ErrorConstructor(m)
            return original.apply(this, args);
        }
    }
}