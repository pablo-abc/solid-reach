import type { JSX } from 'solid-js';

export function composeEventHandler<EventType extends Event = Event>(
  theirHandler: JSX.EventHandlerUnion<any, EventType> | undefined,
  ourHandler: (event: EventType) => any
) {
  return (event: EventType) => {
    if (typeof theirHandler === 'function') {
      theirHandler(event as any);
    } else {
      theirHandler?.[0]?.(null, event as any);
    }
    if (!event.defaultPrevented) ourHandler(event);
  };
}
