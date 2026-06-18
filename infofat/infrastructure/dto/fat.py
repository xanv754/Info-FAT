from typing import Optional
from pydantic import BaseModel, field_validator
from ipaddress import IPv4Address, IPv6Address
from typing import Union
import math


class FatDTO(BaseModel):
    id: int
    serial: str
    fat: Optional[str] = None
    state: str
    region: str
    municipality: str
    parish: str
    ip: Union[IPv4Address, IPv6Address]
    address: Optional[str] = None
    card: int
    port: int
    acronym: str

    @field_validator("fat", "address", mode="before")
    @classmethod
    def normalize_nan(cls, v):
        if isinstance(v, float) and math.isnan(v):
            return None
        return v
