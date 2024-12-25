import logging
from logger import setup_logger

# Configure once at application startup
logger = setup_logger(
    name="NoteBuddy",
    log_file="./logs/app.log",
    log_level=logging.DEBUG
)