from typing import Any
from infofat.shared.errors.error import Error


class MapperError(Error):
    def __init__(self, message: str, error: Any = None) -> None:
        module = "Mapper"
        super().__init__(module, message, error)


class FatMapperError(MapperError):
    def __init__(self, extra_msg: str | None = None, error: Any = None) -> None:
        message = "Error parsing data"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(message, error)
