from abc import ABC, abstractmethod
from pandas import DataFrame


class DataWriter(ABC):
    @abstractmethod
    def export(self, data: DataFrame) -> str:
        """Exports the data to a file in the system."""
        pass
