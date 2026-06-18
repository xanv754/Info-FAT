import click
from infofat.infrastructure.cli.updater.database import DatabaseUpdaterCLI
from infofat.shared import Terminal, Log


@click.group()
def cli() -> None:
    """Commands to update all system information"""
    pass


@cli.command(help="Update the system database file")
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
def database(asf: str, olt: str) -> None:
    terminal = Terminal()

    message = "Starting the update process"
    Log.info(message)

    with terminal.status(message) as status:
        DatabaseUpdaterCLI.execute(asf, olt, status, terminal)
