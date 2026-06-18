from pandas import DataFrame
from infofat.shared import ASFColumn, ASFServiceError, ASFMissingColumns
from infofat.domain.services.interface import DataService
from infofat.domain.ports.data_reader import DataReader


class ASFService(DataService):
    _data: DataFrame

    def __init__(self, reader: DataReader) -> None:
        data = reader.get_data()
        data = self._clean_data(data)
        self._data = data

    def _clean_data(self, data: DataFrame) -> DataFrame:
        """Sanitizes the DataFrame to ensure correct structure and data quality."""
        try:
            data.columns = data.columns.str.upper()
            data.columns = data.columns.str.upper().str.replace(" ", "_")

            # Necessary columns
            necessary_col = ASFColumn.columns()
            data_col = data.columns.to_list()
            if not set(necessary_col).issubset(data_col):
                missing_cols = list(set(necessary_col) - set(data_col))
                raise ASFMissingColumns(missing_cols)
            df = data[ASFColumn.columns()]

            # Duplicates
            df = df.drop_duplicates()
        except ASFMissingColumns:
            raise
        except Exception as error:
            raise ASFServiceError(error=error)
        else:
            return df

    def get_data(self) -> DataFrame:
        return self._data
