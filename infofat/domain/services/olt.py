from pandas import DataFrame
from infofat.shared import ASFColumn, OLTColumn, OLTServiceError, OLTMissingColumns
from infofat.domain.services.interface import DataService
from infofat.domain.ports.data_reader import DataReader


class OLTService(DataService):
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
            necessary_col = OLTColumn.columns()
            data_col = data.columns.to_list()
            if not set(necessary_col).issubset(data_col):
                missing_cols = list(set(necessary_col) - set(data_col))
                raise OLTMissingColumns(missing_cols)
            df = data[OLTColumn.columns()]

            # Duplicates
            df = df.drop_duplicates()

            # Standard columns
            df[OLTColumn.IP.value] = df[OLTColumn.IP.value].astype(str)
            df[OLTColumn.ACRONYM.value] = df[OLTColumn.ACRONYM.value].astype(str)
            df[OLTColumn.ACRONYM.value] = df[OLTColumn.ACRONYM.value].str.upper()

            # Repair IP
            df[OLTColumn.IP.value] = df[OLTColumn.IP.value].apply(
                lambda x: self._repair_ip(x)
            )

            # Delete empty values
            df = df.dropna(subset=[OLTColumn.IP.value])

            # Rename columns
            df = df.rename(columns={OLTColumn.IP.value: ASFColumn.OLT.value})
        except OLTMissingColumns:
            raise
        except Exception as error:
            raise OLTServiceError(error=error)
        else:
            return df

    def _repair_ip(self, ip: str) -> str:
        """Returns the fixed IP values."""
        if "." in ip:
            return str(ip)

        input_ip = str(ip)
        ip = ""
        count = 0
        for char in input_ip[::-1]:
            if count == 3:
                ip = ip + "."
                count = 0
            ip = ip + char
            count += 1

        if ip[0] == ".":
            ip = ip[1:]

        return ip[::-1]

    def get_data(self) -> DataFrame:
        return self._data
