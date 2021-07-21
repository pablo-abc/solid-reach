import Tooltip from './src';
import './styles.css';

export default {
  title: 'Tooltip',
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

const Template: any = () => {
  return (
    <div style={{ 'max-width': '500px' }}>
      <Tooltip label="Notifications">
        {(trigger) => (
          <button style={{ 'font-size': '25px' }} {...trigger}>
            <span>🔔</span>
          </button>
        )}
      </Tooltip>
      <Tooltip label="Settings">
        {(trigger) => (
          <button style={{ 'font-size': '25px' }} {...trigger}>
            <span aria-hidden>⚙️</span>
          </button>
        )}
      </Tooltip>

      <div style={{ float: 'right' }}>
        <Tooltip label="Notifications" aria-label="3 Notifications">
          {(trigger) => (
            <button style={{ 'font-size': '25px' }} {...trigger}>
              <span>🔔</span>
              <span>3</span>
            </button>
          )}
        </Tooltip>
      </div>
    </div>
  );
};

export const Basic = Template.bind({});
