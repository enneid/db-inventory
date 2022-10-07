from datetime import datetime
import typing
from pydantic import BaseModel

class SchemeBase(BaseModel):
      
    # Workaround for serializing properties with pydantic until
    # https://github.com/samuelcolvin/pydantic/issues/935
    # is solved
    @classmethod
    def get_properties(cls):
        return [prop for prop in dir(cls) if isinstance(getattr(cls, prop), property)]

    def dict(self, *args, **kwargs):
        self.__dict__.update(
            {prop: getattr(self, prop) for prop in self.get_properties()}
        )
        return super().dict(*args, **kwargs)

    def json(
        self,
        *args,
        **kwargs,
    ) -> str:
        self.__dict__.update(
            {prop: getattr(self, prop) for prop in self.get_properties()}
        )

        return super().json(*args, **kwargs)

class TimestampScheme(SchemeBase):
    created_at: datetime
    updated_at: datetime
    # created_at_no: typing.Optional[int]
    # updated_at_no: typing.Optional[int]
   
    @property
    def created_at_no(self) -> typing.Optional[int]:
        return self._get_timestamp("created_at")

    @property
    def updated_at_no(self) -> typing.Optional[int]:
        return self._get_timestamp("updated_at")

    def _get_timestamp(self, field) -> typing.Optional[int]:
        attr: datetime = getattr(self, field, None)
        if(attr is None): return None
        return attr.timestamp()