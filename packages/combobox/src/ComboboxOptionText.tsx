import { createMemo, For, Show } from 'solid-js';
import {
  useComboboxOptionContext,
  useInternalComboboxContext,
} from './context';
import { HighlightWords } from './utils';

export default function ComboboxOptionText() {
  const { value } = useComboboxOptionContext();
  const { data } = useInternalComboboxContext();

  const results = createMemo(() => {
    return HighlightWords.findAll({
      searchWords: escapeRegexp(data.value || '').split(/\s+/),
      textToHighlight: value(),
    });
  });

  return (
    <Show when={results().length} fallback={value()}>
      <For each={results()}>
        {(result) => {
          const str = value().slice(result.start, result.end);
          return (
            <span
              data-reach-combobox-option-text=""
              data-user-value={result.highlight ? true : undefined}
              data-suggested-value={result.highlight ? undefined : true}
            >
              {str}
            </span>
          );
        }}
      </For>
    </Show>
  );
}

export function escapeRegexp(str: string) {
  return String(str).replace(/([.*+?=^!:${}()|[\]/\\])/g, '\\$1');
}
