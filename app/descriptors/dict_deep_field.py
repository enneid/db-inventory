import app.libs.dict_helper
class DictDeepField():
    path = None
    def __init__(self, path=None, dictfield="metadata"):
        self.dictfield = dictfield
        self.path = path
    def __get__(self, instance, objtype=None):
        if instance is None: #required for getattr(Class, "param")
            return self
        dict = getattr(instance, self.dictfield)
        if(dict is None): return None
        return app.libs.dict_helper.get_travers(dict, self.path)
    def __set__(self, instance, value):
        dict = getattr(instance, self.dictfield)
        print(instance, self.dictfield)
        if(dict is None):  
            setattr(instance, self.dictfield, {})
            dict = getattr(instance, self.dictfield)
        return app.libs.dict_helper.set_travers(dict, self.path, value)
    def __set_name__(self, owner, name):
        print("set_name", owner)
        if(self.path == None): self.path = name