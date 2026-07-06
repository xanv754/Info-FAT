from enum import Enum


class BaseColumn(str, Enum):
    """Base enum providing a helper to list all column values."""

    @classmethod
    def columns(cls) -> list[str]:
        return [col.value for col in cls]


class ASFColumn(BaseColumn):
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


class ASFModColumn(BaseColumn):
    ODN_GDA = "ODN_GDA"
    ZONAS_GDA = "ZONAS_GDA"
    HOSTNAME_OLT = "HOSTNAME_OLT"
    STATUS_CRM = "STATUS_CRM"


class OLTColumn(BaseColumn):
    IP = "IP"
    ACRONYM = "ACRONIMO"
