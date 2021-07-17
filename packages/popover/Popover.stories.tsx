import { createSignal, Show } from 'solid-js';
import Popover, {
  positionMatchWidth,
  positionRight,
  positionDefault,
} from './src';

export default {
  title: 'Popover',
  argTypes: {
    position: {
      options: ['default', 'match width', 'right'],
      control: 'select',
    },
  },
};

const positions = {
  default: positionDefault,
  'match width': positionMatchWidth,
  right: positionRight,
};

const Template: any = (props: any) => {
  let ref: HTMLElement;
  const [value, setValue] = createSignal('');
  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
      }}
    >
      <label for="popover-example">Type to show popover</label>
      <textarea
        id="popover-example"
        ref={ref}
        type="string"
        value={value()}
        placeholder="Type to show popover"
        onInput={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      <Show when={value().length > 0}>
        <Popover targetRef={ref} position={positions[props.position]}>
          <div
            style={{
              border: '1px solid #000',
              padding: '1rem',
            }}
          >
            I am a popover
          </div>
        </Popover>
      </Show>
    </div>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  position: 'default',
};
