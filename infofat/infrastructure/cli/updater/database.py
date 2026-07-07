from pathlib import Path
from rich.status import Status
from infofat.shared import Log, Terminal
from infofat.application import DatabaseUpdateUseCase, MODDatabaseUpdateUseCase
from infofat.infrastructure.readers.csv import CSVReader
from infofat.infrastructure.readers.excel import ExcelReader
from infofat.infrastructure.writers.csv import CSVWriter


class DatabaseUpdaterCLI:
    @staticmethod
    def basic_execute(
        asf_path: str, olt_path: str, status: Status, terminal: Terminal
    ) -> None:
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
            exporter = CSVWriter()
            use_case = DatabaseUpdateUseCase(asf_reader, olt_reader, exporter)
            result = use_case.execute()

            if result:
                message = "Process completed successfully"
                success, failed = True, False
            else:
                message = "Process terminated with errors"
                success, failed = False, True
            Log.info(message)
            terminal.info(message, success=success, failed=failed)
        except:
            message = "Process execution interrupted by errors"
            Log.error(message)
            terminal.error(message)
            raise

    @staticmethod
    def mod_execute(
        mod_path: str, status: Status, terminal: Terminal
    ) -> None:
        try:
            terminal.loading(status, "Fetching file information...")
            asf_filepath = Path(mod_path)
            if asf_filepath.suffix == ".xlsx":
                asf_reader = ExcelReader(mod_path)
            else:
                asf_reader = CSVReader(mod_path)

            terminal.loading(status, "Processing retrieved information...")
            exporter = CSVWriter()
            use_case = MODDatabaseUpdateUseCase(asf_reader, exporter)
            result = use_case.execute()

            if result:
                message = "Process completed successfully"
                success, failed = True, False
            else:
                message = "Process terminated with errors"
                success, failed = False, True
            Log.info(message)
            terminal.info(message, success=success, failed=failed)
        except:
            message = "Process execution interrupted by errors"
            Log.error(message)
            terminal.error(message)
            raise
