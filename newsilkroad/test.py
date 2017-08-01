"""Utility functions for writing site tests."""
import io

from django.core.management import call_command


class CommandTestMixin(object):
    """Helpers for running a management command in tests."""

    command = ''
    defaults = {}

    def call_command(self, *args, **kwargs):
        command_args = self.defaults.copy()
        command_args.update(kwargs)
        stdout = io.StringIO()
        stderr = io.StringIO()
        command_args['stdout'] = stdout
        command_args['stderr'] = stderr
        call_command(self.command, *args, **command_args)
        stdout.seek(0)
        stderr.seek(0)
        return stdout, stderr
