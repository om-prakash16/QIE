import functools
import logging
from typing import Any, Callable, Optional, TypeVar, cast
from cachetools import TTLCache

logger = logging.getLogger(__name__)

T = TypeVar("T")

# In-memory TTL cache for expensive AI operations
# Default: 1000 items max, 5 minutes expiry
_AI_CACHE = TTLCache(maxsize=1000, ttl=300)

def cache_result(ttl: int = 300, maxsize: int = 1000):
    """
    Simple TTL cache decorator for async functions.
    Uses function name and arguments as the cache key.
    """
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Create a simple cache key from func name and args
            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            if key in _AI_CACHE:
                logger.debug(f"Cache hit for {func.__name__}")
                return _AI_CACHE[key]
            
            logger.debug(f"Cache miss for {func.__name__}")
            result = await func(*args, **kwargs)
            _AI_CACHE[key] = result
            return result
        return wrapper
    return decorator

def clear_ai_cache():
    """Manually clear the global AI cache."""
    _AI_CACHE.clear()
    logger.info("AI Cache cleared.")
