def popattr(hash, key, default=None):
    try:
        hash.pop(key)
    except:
        return default    

def get_travers(hash, keypath, separator=".", none_policy="none"):
    keypath = keypath.split(separator)
    for key in keypath:
        if(not(key in hash)):
            if(none_policy == "none"): return None
            raise KeyError(key)
        hash = hash[key]
    return hash

def set_travers(hash, keypath, value, separator=".", none_policy="none"):
    keypath = keypath.split(separator)
    size = len(keypath)-1
    for idx, key in enumerate(keypath):
        if(size == idx):
            hash[key] = value
            return
        if(not(key in hash)):
            if(none_policy == "none"): return
            if(none_policy == "error"):  raise KeyError(key)
            hash[key] = dict()
        hash = hash[key]

        