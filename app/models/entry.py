from django.db import models
from .app_model import AppModel
from app import descriptors

class Entry(AppModel):
    resource = models.ForeignKey('Resource', on_delete=models.SET_NULL, null=True)
    resource_code = descriptors.UpperCaseCharField(max_length=30, db_index=True)
    # user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    username = descriptors.UpperCaseCharField(max_length=30, db_index=True)
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True)
    department_code = descriptors.UpperCaseCharField(max_length=30, db_index=True)
    operation = descriptors.UpperCaseCharField(max_length=30, db_index=True, null=False)
    message = models.CharField(max_length=255,  null=False)
    amount = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    metadata = models.JSONField(default=dict)