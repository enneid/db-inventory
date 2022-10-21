export class Exception extends Error {
    public constructor(message?: string) {
        super(message);  // 'Error' breaks prototype chain here
        //https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        //https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = (<any>this.constructor).name; // restore prototype chain
    }
}


export class DependencyError extends Exception{
    constructor(public key: string){super();}
}

export class NullDependencyError extends DependencyError{
}

export class CircularDependencyError extends DependencyError{
}

export class InvalidOperation extends Exception {
    
}

export class InvalidParams extends Exception {
}


 
