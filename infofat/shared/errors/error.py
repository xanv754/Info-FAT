from typing import Any
from infofat.shared.outputs.logger import Log
from infofat.shared.outputs.terminal import Terminal


class Error(Exception):
    module: str
    message: str
    error: Any

    def __init__(self, module: str, message: str, error: Any = None) -> None:
        self.module = module
        self.error = error

        if error:
            message = message + ".\n" + repr(error)
        self.message = f"{self.module}: {message}"

        Log.error(self.message)
        Terminal.error(self.message)

        super().__init__(self.message)

    def __str__(self) -> str:
        return self.message
