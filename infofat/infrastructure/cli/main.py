import click
from infofat.infrastructure.cli.updater.cli import cli as updater_commands
from infofat.infrastructure.cli.report.cli import cli as report_commands


@click.group()
def cli() -> None:
    """System for visualizing OLT FAT information"""
    pass


cli.add_command(updater_commands, "updater")
cli.add_command(report_commands, "report")

if __name__ == "__main__":
    cli()
