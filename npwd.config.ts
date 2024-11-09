import App from './src/App';
import { AppIcon } from './icon';

interface Settings {
  language: 'en';
}

export const path = '/npwd_blackmarket';
export default (settings: Settings) => ({
  id: 'npwd_blackmarket',
  path,
  nameLocale: "Market", 
  color: '#fff',
  backgroundColor: '#333',
  icon: AppIcon,
  app: App,
});