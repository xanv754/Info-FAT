import pandas as pd
from infofat.shared import FailedImportError
from infofat.infrastructure.readers.base import Reader


class ExcelReader(Reader):
    def get_data(self) -> pd.DataFrame:
        try:
            import warnings

            warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")

            return pd.read_excel(self._filepath)
        except Exception as error:
            raise FailedImportError(filepath=str(self._filepath.resolve()), error=error)
