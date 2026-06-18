from enum import Enum


class ASFColumn(str, Enum):
    SERIAL = "SERIAL_MODEM"
    FAT = "FAT"
    STATE = "ESTADO"
    REGION = "REGION"
    MUNICIPALITY = "MUNICIPIO"
    PARISH = "PARROQUIA"
    OLT = "IP_OLT"
    ADDRESS = "CQE"
    CARD = "SLOT"
    PORT = "PUERTO"

    @classmethod
    def columns(cls) -> list[str]:
        return [col.value for col in cls]


class OLTColumn(str, Enum):
    IP = "IP"
    ACRONYM = "ACRONIMO"

    @classmethod
    def columns(cls) -> list[str]:
        return [col.value for col in cls]
