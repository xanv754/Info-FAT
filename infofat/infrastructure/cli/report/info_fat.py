from pathlib import Path
from rich.status import Status
from infofat.shared import Log, Terminal, NotFoundDirectoryError
from infofat.application import DataReportUseCase
from infofat.infrastructure.readers.csv import CSVReader
from infofat.infrastructure.readers.excel import ExcelReader
from infofat.infrastructure.writers.excel import ExcelWriter


class ReportUpdaterCLI:
    @staticmethod
    def execute(
        asf_path: str,
        olt_path: str,
        status: Status,
        terminal: Terminal,
        outpath: str | None = None,
    ) -> str:
        try:
            terminal.loading(status, "Fetching file information...")
            asf_filepath = Path(asf_path)
            if asf_filepath.suffix == ".xlsx":
                asf_reader = ExcelReader(asf_path)
            else:
                asf_reader = CSVReader(asf_path)

            olt_filepath = Path(olt_path)
            if olt_filepath.suffix == ".xlsx":
                olt_reader = ExcelReader(olt_path)
            else:
                olt_reader = CSVReader(olt_path)

            terminal.loading(status, "Processing retrieved information...")
            use_case = DataReportUseCase(asf_reader, olt_reader)
            result = use_case.execute()

            terminal.loading(status, "Exporting report...")
            if outpath:
                outdir = Path(outpath)
                if not outdir.is_dir():
                    raise NotFoundDirectoryError(str(outdir.resolve()))
                exporter = ExcelWriter(str(outdir.resolve()))
            else:
                outdir = str(Path.home().resolve())
                exporter = ExcelWriter(outdir)
            return exporter.export(result)
        except:
            raise
