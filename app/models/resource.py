from enum import unique
from operator import index
from django.db import models
from .app_model import AppModel
from app import descriptors

class Resource(AppModel):
    code = descriptors.UpperCaseCharField(unique=True, max_length=30, null=False, db_index=True)
    name = models.CharField(max_length=30, null=False)
    department = models.ForeignKey('Department', on_delete=models.DO_NOTHING, null=False)
    params = descriptors.UpperCaseCharField(max_length=100, null=False)
    amount = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    metadata = models.JSONField(default=dict)
    class Meta: 
        indexes = [
            models.Index('department', 'params', name="department_params"),
            models.Index(fields=['params'])
        ]