from fastapi import APIRouter, Query, HTTPException
from infofat.infrastructure.api.dto.fat import PaginatedFat
from infofat.infrastructure.services.fat import FatService
from infofat.infrastructure.api.types.columns import DataColumns

router = APIRouter()


@router.get("/", response_model=PaginatedFat)
def get_fats(
    ge: int = Query(default=0, ge=0, description="Start index"),
    le: int = Query(default=500, gt=0, description="End index"),
):
    """Get data with FAT information.

    Parameters
    ----------
        ge: Start index.
        le: End index.
    """
    if ge >= le:
        raise HTTPException(status_code=400, detail="'ge' debe ser menor que 'le'")

    try:
        items, total_items, total = FatService.get_interval(ge=ge, le=le)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return PaginatedFat(items=items, total_items=total_items, total=total)


@router.get("/filter", response_model=PaginatedFat)
def get_fats_filter(
    name_columns: list[str] = Query(
        ..., description="List of column names to filter by"
    ),
    values: list[str] = Query(
        ..., description="List of values corresponding to each column"
    ),
):
    """Get filtered FAT data.

    Parameters
    ----------
        name_column: List of column names to filter by.
        value: List of values corresponding to each column.
    """
    name_columns = [col.upper() for col in name_columns]
    values = [value.upper() for value in values]
    if len(name_columns) != len(values):
        raise HTTPException(
            status_code=400,
            detail="'name_column' and 'value' must have the same length of elements",
        )

    valid_columns = DataColumns.lists()
    invalid = [col for col in name_columns if col not in valid_columns]
    if invalid:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid columns: {invalid}. Valid columns: {valid_columns}",
        )

    try:
        items, total_items, total = FatService.get_filter_column(
            name_column=name_columns, value=values
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return PaginatedFat(items=items, total_items=total_items, total=total)
