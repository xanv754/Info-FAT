from typing import Any
from infofat.shared.errors.error import Error


class ServiceError(Error):
    def __init__(self, module: str, message: str, error: Any = None) -> None:
        module = module + "Service"
        super().__init__(module, message, error)


class ASFServiceError(ServiceError):
    def __init__(self, extra_msg: str | None = None, error: Any = None) -> None:
        module = "ASF"
        message = "Failed to fetch ASF file information"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(module, message, error)


class OLTServiceError(ServiceError):
    def __init__(self, extra_msg: str | None = None, error: Any = None) -> None:
        module = "OLT"
        message = "Failed to fetch RELACION_OLT file information"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(module, message, error)


class MergeServiceError(ServiceError):
    def __init__(self, extra_msg: str | None = None, error: Any = None) -> None:
        module = "Data Merge"
        message = "Error merging ASF data with RELACION_OLT data"
        if extra_msg:
            message = message + f". {extra_msg}"
        super().__init__(module, message, error)


class ASFMissingColumns(ASFServiceError):
    def __init__(self, missing_cols: list[str], error: Any = None) -> None:
        message = f"Required columns {missing_cols} not found in the ASF file"
        super().__init__(message, error)


class OLTMissingColumns(OLTServiceError):
    def __init__(self, missing_cols: list[str], error: Any = None) -> None:
        message = f"Required columns {missing_cols} not found in the RELACION_OLT file"
        super().__init__(message, error)
