from infofat.shared import ASFColumn, OLTColumn


class DataColumns:
    @staticmethod
    def lists() -> list[str]:
        return ASFColumn.columns() + OLTColumn.columns()
