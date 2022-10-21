import { concat, difference, intersection, keys, uniq } from "lodash";
import { CircularDependencyError, NullDependencyError } from "./exception";

export function RegExec(reg: RegExp, text: string, offset: number){
    reg.lastIndex = offset || 0;
    let res = reg.exec(text);
    reg.lastIndex = 0;
    return res;
}

const TPL_REGEXP = /%{(\w+)}/g;
export function GetTemplateKeys(tpl: string, regexp: RegExp = TPL_REGEXP){
    let offset = 0
    let vars = [];
    while (true){
        let res = RegExec(regexp, tpl, offset);
        if(res == void 0) break;
        vars.push(res[1])
        offset = res.index+res[0].length;
    }
    return uniq(vars);
}


export function EvalTemplateWithDependencies(look: string, params: Record<string, any>, evaluated?: Record<string,any>, regexp: RegExp = TPL_REGEXP): [string, Record<string, any>, string[]]{
    evaluated = evaluated || {};
    let resolved = keys(evaluated);
    let used = [look]
    let dependencies: Record<string, string[]> = {};
    let deps_tree:Record<string, string[]> = {};
    if(evaluated[look] == void 0) {
        let unresolved = [look];
        used = [look]
        let i = 0;
        while (unresolved.length) {
            if (i > unresolved.length - 1) i = 0
            let key = unresolved[i]
            if(evaluated[key] != void 0){
                unresolved.splice(i, 1);
                continue;
            }
            let val = params[key];
            if(val == void 0 ) throw new NullDependencyError(key);
            val = ""+val;
            let deps =dependencies[key] = dependencies[key] || GetTemplateKeys(val, regexp);
            used = used.concat(deps)
            let deps_unresolved = deps.length ? difference(deps, resolved) : []
            if(!deps_unresolved.length){
                evaluated[key] = EvalTemplate(val, evaluated, regexp);
                resolved.push(key);
                unresolved.splice(i, 1);
                continue;
            }
            let dependents = deps_tree[key] || [];
            let circular = intersection(dependents, deps_unresolved);
            if(circular.length) throw new CircularDependencyError(circular[0]);
            for(let i=0; i<deps_unresolved.length; i++) {
                let k = deps_unresolved[i];
                let dp = deps_tree[k] || [];
                dp = uniq(concat(dp, [key], dependents));
                deps_tree[k] = dp;
                if(unresolved.indexOf(k) == -1) unresolved.push(k)
            }
            i++;
        }

    }

    return [evaluated[look], evaluated, uniq(used)]
}


export function EvalTemplate(tpl: string, params?: {[key: string]: any}, reqexp = TPL_REGEXP){
    return tpl.replace(reqexp, (_, v) => ((params ? params[v] : "") || ""));
}
