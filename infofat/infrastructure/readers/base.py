from abc import abstractmethod
from pandas import DataFrame
from pathlib import Path
from infofat.domain import DataReader
from infofat.shared import NotFoundFileError


class Reader(DataReader):
    _filepath: Path

    def __init__(self, filepath: str) -> None:
        self._filepath = self._get_path(filepath)

    def _get_path(self, path: str) -> Path:
        filepath = Path(path)
        if not filepath.exists():
            raise NotFoundFileError(filepath=path)
        return filepath

    @property
    def path(self) -> Path:
        return self._filepath

    @property
    def filepath(self) -> str:
        return str(self._filepath.resolve())

    @abstractmethod
    def get_data(self) -> DataFrame:
        pass
