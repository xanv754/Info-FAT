from pandas import read_csv, DataFrame
from infofat.shared import Metadata, FailedImportError
from infofat.infrastructure.readers.base import Reader


class CSVReader(Reader):
    def get_data(self) -> DataFrame:
        try:
            return read_csv(self._filepath.resolve(), sep=Metadata.delimiter_data.value)
        except Exception as error:
            raise FailedImportError(filepath=str(self._filepath.resolve()), error=error)
