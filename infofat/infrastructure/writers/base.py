from abc import abstractmethod
from pathlib import Path
from pandas import DataFrame
from infofat.shared import Metadata
from infofat.domain import DataWriter


class Writer(DataWriter):
    _is_csv: bool
    _filepath: Path

    def __init__(self, outdir: str | None = None) -> None:
        dirpath = self._get_dirpath(outdir)
        self._filepath = self._get_filepath(dirpath)

    def _get_dirpath(self, outpath: str | None = None) -> Path:
        """Returns the absolute path of the folder to export."""
        if not outpath:
            dirpath = Metadata.home_path() / Metadata.outdir.value
            self._is_csv = True
        else:
            dirpath = Path(outpath)
            self._is_csv = False
        Path.mkdir(dirpath, exist_ok=True)
        return dirpath

    def _get_filepath(self, dirpath: Path) -> Path:
        """Returns the absolute path of the file to export."""
        if self._is_csv:
            return dirpath / Metadata.database.value
        else:
            return dirpath / Metadata.outfile.value

    @property
    def filepath(self) -> str:
        return str(self._filepath.resolve())

    @abstractmethod
    def export(self, data: DataFrame) -> str:
        pass
