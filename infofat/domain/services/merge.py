from pandas import DataFrame, merge
from infofat.domain.services.interface import DataService
from infofat.shared import ASFColumn, MergeServiceError


class MergeService:
    _asf: DataFrame
    _olt: DataFrame

    def __init__(self, asf: DataService, olt: DataService) -> None:
        self._asf = asf.get_data()
        self._olt = olt.get_data()

    def exec_merge(self) -> DataFrame:
        try:
            df_asf = self._asf
            df_olt = self._olt

            df_merge = merge(df_asf, df_olt, how="inner", on=[ASFColumn.OLT.value])
            return df_merge
        except Exception as error:
            raise MergeServiceError(error=error)
