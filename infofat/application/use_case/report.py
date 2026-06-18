from pandas import DataFrame
from infofat.domain import DataReader, DataWriter, ASFService, OLTService, MergeService
from infofat.shared import (
    DatabaseUpdateError,
    ASFServiceError,
    OLTServiceError,
    ASFMissingColumns,
    OLTMissingColumns,
    FailedExportError,
    FailedImportError,
)


class DataReportUseCase:
    _asf_reader: DataReader
    _olt_reader: DataReader

    def __init__(self, asf_reader: DataReader, olt_reader: DataReader) -> None:
        self._asf_reader = asf_reader
        self._olt_reader = olt_reader

    def execute(self) -> DataFrame:
        try:
            asf = ASFService(self._asf_reader)
            olt = OLTService(self._olt_reader)

            merge = MergeService(asf, olt)
            data = merge.exec_merge()
        except (
            ASFServiceError,
            OLTServiceError,
            ASFMissingColumns,
            OLTMissingColumns,
            FailedExportError,
            FailedImportError,
        ):
            raise
        except Exception as error:
            raise DatabaseUpdateError(error=error)
        else:
            return data
