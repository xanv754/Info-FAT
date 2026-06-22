from infofat.infrastructure.dto.fat import FatDTO
from infofat.infrastructure.mappers.fat import FatMapper
from infofat.infrastructure.readers.csv import CSVReader
from infofat.shared import Metadata
import pandas as pd


class FatService:
    @staticmethod
    def get_all() -> tuple[list[FatDTO], int, int]:
        database_path = str(
            (
                Metadata.home_path() / Metadata.outdir.value / Metadata.database.value
            ).resolve()
        )

        reader = CSVReader(database_path)
        df = reader.get_data()

        json = FatMapper.to_model(df)
        return json, len(df), len(df)

    @staticmethod
    def get_interval(ge: int = 1, le: int = 500) -> tuple[list[FatDTO], int, int]:
        database_path = str(
            (
                Metadata.home_path() / Metadata.outdir.value / Metadata.database.value
            ).resolve()
        )

        reader = CSVReader(database_path)
        df = reader.get_data()
        total = len(df)

        if ge < 0 or le > total or le < ge:
            raise ValueError("Index out of range")

        df = df[ge:le]

        json = FatMapper.to_model(df)
        return json, len(df), total

    @staticmethod
    def get_filter_column(
        name_column: list[str], value: list[str], ge: int = 1, le: int = 500
    ) -> tuple[list[FatDTO], int, int]:
        database_path = str(
            (
                Metadata.home_path() / Metadata.outdir.value / Metadata.database.value
            ).resolve()
        )

        reader = CSVReader(database_path)
        df = reader.get_data()
        total = len(df)

        if len(name_column) != len(value):
            raise ValueError("The column and value lists must have the same length")

        filters = {}
        for col, val in zip(name_column, value):
            if col not in df.columns:
                raise ValueError(f"Column '{col}' not found in dataset")
            filters.setdefault(col, []).append(val)

        mask = pd.Series(True, index=df.index)
        for col, values in filters.items():
            for val in values:
                mask &= df[col].astype(str) == val

        df = df[mask]
        df = df.reset_index()

        if ge < 0 or le > total or le < ge:
            raise ValueError("Index out of range")

        total_df = len(df)
        df = df[ge:le]

        json = FatMapper.to_model(df)
        return json, total_df, total
