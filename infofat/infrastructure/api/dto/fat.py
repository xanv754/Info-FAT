from pydantic import BaseModel
from infofat.infrastructure.dto.fat import FatDTO


class PaginatedFat(BaseModel):
    items: list[FatDTO]
    total_items: int
    total: int
