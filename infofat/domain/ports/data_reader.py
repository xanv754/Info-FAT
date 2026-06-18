from abc import ABC, abstractmethod
from pandas import DataFrame


class DataReader(ABC):
    @abstractmethod
    def get_data(self) -> DataFrame:
        """Returns the DataFrame with the file data."""
        pass
