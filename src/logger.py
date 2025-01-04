import logging
from datetime import datetime

# Module-level logger instance
_logger_instance = None

def setup_logger(
    name: str = "app",
    log_level: int = logging.INFO,
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
        
        # Console handler only
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