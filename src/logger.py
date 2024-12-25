import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler

# Module-level logger instance
_logger_instance = None

def setup_logger(
    name: str = "app",
    log_level: int = logging.INFO,
    log_file: str = "./logs/app.log",
    max_file_size: int = 1024 * 1024,  # 1MB
    backup_count: int = 3,
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
) -> logging.Logger:
    """
    Configure and return a global logger instance.
    If already initialized, returns the existing instance.
    """
    global _logger_instance
    
    if _logger_instance is not None:
        return _logger_instance
        
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    
    # Avoid adding handlers if they already exist
    if not logger.handlers:
        # Create formatter
        formatter = logging.Formatter(log_format)
        
        # Handle directory creation only if there's a directory path
        log_dir = os.path.dirname(log_file)
        if log_dir:  # Only create directory if path is not empty
            os.makedirs(log_dir, exist_ok=True)
        
        # File handler with rotation
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=max_file_size,
            backupCount=backup_count
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    _logger_instance = logger
    return logger

def get_logger() -> logging.Logger:
    """
    Get the configured logger instance.
    If not yet configured, sets up with default parameters.
    """
    global _logger_instance
    if _logger_instance is None:
        _logger_instance = setup_logger()
    return _logger_instance