from typing import Any
from infofat.shared.errors.error import Error
from pathlib import Path


class ReaderError(Error):
    def __init__(self, message: str, error: Any = None) -> None:
        module = "Import"
        super().__init__(module, message, error)


class NotFoundDirectoryError(ReaderError):
    def __init__(
        self, dirpath: str, extra_msg: str | None = None, error: Any = None
    ) -> None:
        path = Path(dirpath)
        message = f"Directory {path.name} not found"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(message, error)


class NotFoundFileError(ReaderError):
    def __init__(
        self, filepath: str, extra_msg: str | None = None, error: Any = None
    ) -> None:
        path = Path(filepath)
        message = f"File {path.name} not found"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(message, error)


class FailedImportError(ReaderError):
    def __init__(
        self, filepath: str, extra_msg: str | None = None, error: Any = None
    ) -> None:
        path = Path(filepath)
        message = f"Failed to import file {path.name}"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(message, error)
