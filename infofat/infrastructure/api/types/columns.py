from infofat.shared import ASFColumn, OLTColumn, ASFModColumn


class DataColumns:
    @staticmethod
    def lists() -> list[str]:
        return ASFColumn.columns() + OLTColumn.columns() + [ASFModColumn.ZONAS_GDA.value + ASFModColumn.ODN_GDA.value + ASFModColumn.STATUS_CRM.value]
