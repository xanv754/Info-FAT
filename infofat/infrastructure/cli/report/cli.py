import click
from infofat.infrastructure.cli.report.info_fat import ReportUpdaterCLI
from infofat.shared import Terminal, Log


@click.group()
def cli() -> None:
    """Commands for report output"""
    pass


@cli.command(help="Get the report with FAT information")
@click.option(
    "--asf",
    required=True,
    type=click.Path(exists=True, file_okay=True),
    help="Path to the ASF file",
)
@click.option(
    "--olt",
    required=True,
    type=click.Path(exists=True, file_okay=True),
    help="Path to the RELACION_OLT file",
)
@click.option(
    "--dir",
    required=False,
    type=click.Path(exists=True, file_okay=False, dir_okay=True),
    help="Output directory path",
)
def fat(asf: str, olt: str, dir: str | None = None) -> None:
    terminal = Terminal()

    message = "Starting report export"
    Log.info(message)

    try:
        with terminal.status(message) as status:
            filepath = ReportUpdaterCLI.execute(asf, olt, status, terminal, dir)
    except:
        message = "Process terminated with errors"
        success, failed = False, True
    else:
        message = f"Process completed successfully. Exported in {filepath}"
        success, failed = True, False
    finally:
        Log.info(message)
        terminal.info(message, success=success, failed=failed)
