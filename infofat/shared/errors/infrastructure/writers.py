from typing import Any
from infofat.shared.errors.error import Error
from pathlib import Path


class WriteError(Error):
    def __init__(self, message: str, error: Any = None) -> None:
        module = "Export"
        super().__init__(module, message, error)


class FailedExportError(WriteError):
    def __init__(
        self, filepath: str, extra_msg: str | None = None, error: Any = None
    ) -> None:
        path = Path(filepath)
        message = f"Failed to export file {path.name}"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(message, error)
