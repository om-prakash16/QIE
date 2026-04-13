import asyncio
import logging
from typing import Callable, Any, Dict, List, Coroutine

logger = logging.getLogger(__name__)

class EventBus:
    """
    A simple, asynchronous event bus for decoupling business logic from side effects.
    Supports publish/subscribe patterns within the same process.
    """
    _instance = None
    _subscribers: Dict[str, List[Callable[[Any], Coroutine[Any, Any, None]]]] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventBus, cls).__new__(cls)
            cls._subscribers = {}
        return cls._instance

    def subscribe(self, event_name: str, callback: Callable[[Any], Coroutine[Any, Any, None]]):
        """Register an async listener for a specific event."""
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        self._subscribers[event_name].append(callback)
        logger.info(f"Subscribed handler to event: {event_name}")

    async def emit(self, event_name: str, data: Any = None):
        """
        Trigger an event and all its subscribers.
        Side effects run asynchronously.
        """
        if event_name not in self._subscribers:
            logger.debug(f"No subscribers for event: {event_name}")
            return

        logger.info(f"Emitting event: {event_name}")
        
        # We use asyncio.create_task for each handler to ensure they run concurrently 
        # and don't block each other or the main flow.
        for callback in self._subscribers[event_name]:
            try:
                asyncio.create_task(self._safe_execute(callback, data, event_name))
            except Exception as e:
                logger.error(f"Failed to schedule event handler for {event_name}: {str(e)}")

    async def _safe_execute(self, callback: Callable, data: Any, event_name: str):
        """Helper to ensure individual handler failures don't crash other handlers."""
        try:
            await callback(data)
        except Exception as e:
            logger.error(f"Error in event handler for {event_name}: {str(e)}")

# Singleton instance for global use
bus = EventBus()
