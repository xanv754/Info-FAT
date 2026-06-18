from infofat.infrastructure.writers.base import Writer
from infofat.shared import FailedExportError
from pandas import DataFrame


class ExcelWriter(Writer):
    def export(self, data: DataFrame) -> str:
        try:
            data.to_excel(self._filepath, index=False)
        except Exception as error:
            raise FailedExportError(filepath=str(self._filepath.resolve()), error=error)
        else:
            return str(self._filepath.resolve())
