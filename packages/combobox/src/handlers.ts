import { useInternalComboboxContext } from './context';
import {
  BLUR,
  ESCAPE,
  IDLE,
  INTERACT,
  INTERACTING,
  NAVIGATE,
  NAVIGATING,
  SELECT_WITH_KEYBOARD,
} from './machine';

export function useKeyDown() {
  const {
    data,
    onSelect,
    state,
    transition,
    autocompletePropRef,
    persistSelectionRef,
    descendants: options,
  } = useInternalComboboxContext();

  const navigationValue = () => data.navigationValue;

  return function handleKeyDown(event: KeyboardEvent) {
    let index = options().findIndex(
      ({ dataset }) => dataset.value === navigationValue()
    );

    function getNextOption() {
      let atBottom = index === options().length - 1;
      if (atBottom) {
        if (autocompletePropRef.current) {
          // Go back to the value the user has typed because we are
          // autocompleting and they need to be able to get back to what
          // they had typed w/o having to backspace out.
          return null;
        } else {
          // cycle through
          return getFirstOption();
        }
      } else {
        // Go to the next item in the list
        return options()[(index + 1) % options().length];
      }
    }

    function getPreviousOption() {
      let atTop = index === 0;
      if (atTop) {
        if (autocompletePropRef.current) {
          // Go back to the value the user has typed because we are
          // autocompleting and they need to be able to get back to what
          // they had typed w/o having to backspace out.
          return null;
        } else {
          // cycle through
          return getLastOption();
        }
      } else if (index === -1) {
        // displaying the user's value, so go select the last one
        return getLastOption();
      } else {
        // normal case, select previous
        return options()[(index - 1 + options().length) % options().length];
      }
    }

    function getFirstOption() {
      return options()[0];
    }

    function getLastOption() {
      return options()[options().length - 1];
    }

    switch (event.key) {
      case 'ArrowDown':
        // Don't scroll the page
        event.preventDefault();
        if (!options() || !options().length) {
          return;
        }

        if (state() === IDLE) {
          // Opening a closed list
          transition(NAVIGATE, {
            persistSelection: persistSelectionRef.current,
          });
        } else {
          let next = getNextOption();
          transition(NAVIGATE, {
            value: next ? next.dataset.value : null,
          });
        }
        break;

      // A lot of duplicate code with ArrowDown up next, I'm already over it.
      case 'ArrowUp':
        // Don't scroll the page
        event.preventDefault();
        if (!options() || options().length === 0) {
          return;
        }

        if (state() === IDLE) {
          transition(NAVIGATE);
        } else {
          let prev = getPreviousOption();
          transition(NAVIGATE, {
            value: prev ? prev.dataset.value : null,
          });
        }
        break;

      case 'Home':
      case 'PageUp':
        // Don't scroll the page
        event.preventDefault();
        if (!options() || options().length === 0) {
          return;
        }

        if (state() === IDLE) {
          transition(NAVIGATE);
        } else {
          transition(NAVIGATE, { value: getFirstOption().dataset.value });
        }
        break;

      case 'End':
      case 'PageDown':
        // Don't scroll the page
        event.preventDefault();
        if (!options() || options().length === 0) {
          return;
        }

        if (state() === IDLE) {
          transition(NAVIGATE);
        } else {
          transition(NAVIGATE, { value: getLastOption().dataset.value });
        }
        break;

      case 'Escape':
        if (state() !== IDLE) {
          transition(ESCAPE);
        }
        break;
      case 'Enter':
        if (state() === NAVIGATING && navigationValue !== null) {
          // don't want to submit forms
          event.preventDefault();
          onSelect && onSelect(navigationValue() ?? undefined);
          transition(SELECT_WITH_KEYBOARD);
        }
        break;
    }
  };
}

export function useBlur() {
  const { state, transition, popoverRef, inputRef, buttonRef } =
    useInternalComboboxContext();

  return function handleBlur(event: FocusEvent) {
    let popover = popoverRef.current;
    let input = inputRef.current;
    let button = buttonRef.current;
    let activeElement = event.relatedTarget as Node;

    // we on want to close only if focus props outside the combobox
    if (activeElement !== input && activeElement !== button && popover) {
      if (popover.contains(activeElement)) {
        // focus landed inside the combobox, keep it open
        if (state() !== INTERACTING) {
          transition(INTERACT);
        }
      } else {
        // focus landed outside the combobox, close it.
        transition(BLUR);
      }
    }
  };
}
