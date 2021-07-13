export function composeEventHandler<EventType extends Event>(
  theirHandler: ((event: EventType) => any) | undefined,
  ourHandler: (event: EventType) => any
) {
  return (event: EventType) => {
    theirHandler?.(event);
    if (!event.defaultPrevented) ourHandler(event);
  };
}
