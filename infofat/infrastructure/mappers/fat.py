from pandas import DataFrame
from infofat.infrastructure.dto import FatDTO
from infofat.shared import ASFColumn, OLTColumn, ASFModColumn, FatMapperError


class FatMapper:
    @staticmethod
    def to_model(df: DataFrame) -> list[FatDTO]:
        """Return the data mapped to the DTO."""
        fats = []
        try:
            data = df.to_dict(orient="records")
            for info in data:
                fats.append(
                    FatDTO(
                        id=info["id"],
                        serial=info[ASFColumn.SERIAL.value],
                        fat=info[ASFColumn.FAT.value],
                        state=info[ASFColumn.STATE.value],
                        region=info[ASFColumn.REGION.value],
                        municipality=info[ASFColumn.MUNICIPALITY.value],
                        parish=info[ASFColumn.PARISH.value],
                        ip=info[ASFColumn.OLT.value],
                        address=info[ASFColumn.ADDRESS.value],
                        card=info[ASFColumn.CARD.value],
                        port=info[ASFColumn.PORT.value],
                        acronym=info[OLTColumn.ACRONYM.value],
                        odn_gda=str(info[ASFModColumn.ODN_GDA.value]),
                        zone_gda=str(info[ASFModColumn.ZONAS_GDA.value]),
                        status_crm=str(info[ASFModColumn.STATUS_CRM.value])
                    )
                )
        except Exception as error:
            raise FatMapperError(error=error)
        else:
            return fats
