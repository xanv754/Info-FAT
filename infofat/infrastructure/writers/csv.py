from infofat.infrastructure.writers.base import Writer
from infofat.shared import Metadata, FailedExportError
from pandas import DataFrame


class CSVWriter(Writer):
    def export(self, data: DataFrame) -> str:
        try:
            data.to_csv(
                self._filepath,
                sep=Metadata.delimiter_data.value,
                index=True,
                index_label="id",
            )
        except Exception as error:
            raise FailedExportError(filepath=str(self._filepath.resolve()), error=error)
        else:
            return str(self._filepath.resolve())
