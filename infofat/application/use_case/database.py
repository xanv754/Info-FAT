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


class DatabaseUpdateUseCase:
    _asf_reader: DataReader
    _olt_reader: DataReader
    _exporter: DataWriter

    def __init__(
        self, asf_reader: DataReader, olt_reader: DataReader, exporter: DataWriter
    ) -> None:
        self._asf_reader = asf_reader
        self._olt_reader = olt_reader
        self._exporter = exporter

    def execute(self) -> bool:
        try:
            asf = ASFService(self._asf_reader)
            olt = OLTService(self._olt_reader)

            merge = MergeService(asf, olt)
            data = merge.exec_merge()

            self._exporter.export(data)
        except (
            ASFServiceError,
            OLTServiceError,
            ASFMissingColumns,
            OLTMissingColumns,
            FailedExportError,
            FailedImportError,
        ):
            return False
        except Exception as error:
            raise DatabaseUpdateError(error=error)
        else:
            return True

class MODDatabaseUpdateUseCase:
    _asf_reader: DataReader
    _exporter: DataWriter

    def __init__(
        self, asf_reader: DataReader, exporter: DataWriter
    ) -> None:
        self._asf_reader = asf_reader
        self._exporter = exporter

    def execute(self) -> bool:
        try:
            asf = ASFService(self._asf_reader, mod=True)
            data = asf.get_data()

            self._exporter.export(data)
        except (
            ASFServiceError,
            ASFMissingColumns,
            FailedExportError,
            FailedImportError,
        ):
            return False
        except Exception as error:
            raise DatabaseUpdateError(error=error)
        else:
            return True
