import logging
from logging.handlers import TimedRotatingFileHandler
from infofat.shared.constants.metadata import Metadata

LOG_FORMAT = "%(asctime)s %(levelname)s - %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
FORMATTER = logging.Formatter(LOG_FORMAT, DATE_FORMAT)


class LogHandler:
    """A handler for all log system operations."""

    _file_handler: TimedRotatingFileHandler
    logger: logging.Logger

    def __init__(self) -> None:
        try:
            dirpath = Metadata.home_path() / Metadata.logdir.value
            dirpath.mkdir(parents=True, exist_ok=True)

            filepath = dirpath / Metadata.logfile.value
            self._file_handler = TimedRotatingFileHandler(
                filepath,
                when="W0",
                interval=1,
                backupCount=4,
                encoding="utf-8",
                utc=True,
            )
            self._file_handler.setFormatter(FORMATTER)

            logging.basicConfig(
                level=logging.INFO,
                handlers=[self._file_handler],
            )

            self.logger = logging.getLogger(__name__)
        except Exception as e:
            print(f"Log Error - {e}")


logHandler = LogHandler()
Log = logHandler.logger

if __name__ == "__main__":
    Log.info("Testing log")
