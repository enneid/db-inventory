
from sqlalchemy.orm import Session
from app import schemes
from app import models
from app.models.resource import ResourceOperation
from app.models.entry import Entry
from app.schemes import department
from .base_cruds import BaseCruds


class ResourceCruds(BaseCruds):
    __model__ = models.Resource
    
    __create_scheme__ = schemes.ResourceBase
    __change_scheme__ = schemes.Resource

    def current_username(self):
        return getattr(self.current_user, "username", "anonymous")

    def current_user_id(self):
        return getattr(self.current_user, "id", None)   

    def department(self):
        return self.record.department
    
    def make_operation(self, operation: ResourceOperation, amount: int, message: str=''):
        message = message.strip()
        username = self.current_username()
        relative = True
        match operation:
            case ResourceOperation.PUSH:
                pass
            case ResourceOperation.POP:
                pass
            case ResourceOperation.SET:
                relative =False
            case ResourceOperation.REMOVE:
                raise Exception("remove not supported")
            case  ResourceOperation.REPORT:
                if(message == ""): 
                    message =f"Resource {self.record.code} from {self.department().name} has been reported error by {username} with amount {amount}"
                amount = 0            
        if(message == ""): 
            message =f"Resource {self.record.code} from {self.department().name} has been {operation.value.lower}ed by {username} with amount {amount}"

        self._change_amount(amount, relative)
        self._create_entry(operation, amount, message)
        self.push_changes()
        self.reload_record()
        return self.record


    def _change_amount(self, variable, relative = True):
        if(relative):
           if(variable == 0): return
           self.record.amount = self.__model__.amount + variable
        else:
           self.record.amount = variable

    def _create_entry(self, operation: ResourceOperation, amount, message):
        dep =  self.department()
        entry = Entry(operation=operation.value, 
            resource_id= self.record.id, 
            resource_code= self.record.code, 
            department_id= dep.id, 
            department_code= dep.code,
            user_id= self.current_user_id(),
            username= self.current_username(),
            amount= amount,
            message= message
        )
        self.db.add(entry)