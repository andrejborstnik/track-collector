#
# LIBRARIES
#


from config_project import LOG_FILE
import logging
import sys


#
# CLASSES
#


class StreamToLogger(object):
    """
    Fake file-like stream object that redirects writes to a logger instance.
    """
    def __init__(self, logger, log_level=logging.INFO, old_stream=None):
        self.logger = logger
        self.log_level = log_level
        self.old_stream = old_stream

    def isatty(self):
        self.old_stream.isatty()

    def flush(self):
        self.old_stream.flush()

    def write(self, buf):
        self.old_stream.write(buf)
        for line in buf.rstrip().splitlines():
            self.logger.log(self.log_level, line.rstrip())


#
# LIB MAIN
#


# Configure logging

logging.basicConfig(
   level=logging.DEBUG,
   format='%(asctime)s:%(levelname)s:%(name)s:%(message)s',
   filename=LOG_FILE,
   filemode='a'
)

stdout_logger = logging.getLogger('STDOUT')
sl = StreamToLogger(stdout_logger, logging.INFO, sys.stdout)
sys.stdout = sl

stderr_logger = logging.getLogger('STDERR')
sl = StreamToLogger(stderr_logger, logging.ERROR, sys.stderr)
sys.stderr = sl
