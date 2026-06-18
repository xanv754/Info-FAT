from typing import Any
from infofat.shared.errors.error import Error


class UseCaseError(Error):
    def __init__(
        self, module: str, message: str | None = None, error: Any = None
    ) -> None:
        module = module + "Use Case"
        if not message:
            message = "Failed to execute use case operation"
        super().__init__(module, message, error)


class DatabaseUpdateError(Error):
    def __init__(self, extra_msg: str | None = None, error: Any = None) -> None:
        module = "Database Update"
        message = "Failed to execute database update use case operation"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(module, message, error)
