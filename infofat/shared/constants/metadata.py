from enum import Enum
from datetime import datetime
from pathlib import Path

DATE = datetime.now().strftime("%Y-%m-%d_%H%M%S")


class Metadata(str, Enum):
    outdir = "data"
    database = "database.csv"
    outfile = f"FAT_OLT_{DATE}.xlsx"

    delimiter_data = ";"

    logdir = "logs"
    logfile = "infofat.log"

    @classmethod
    def home_path(cls) -> Path:
        return Path(__file__).parent.parent.parent.parent
