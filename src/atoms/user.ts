import { atom, selector } from 'recoil';
import { ListingsEvents } from '../../shared/events';
import { User } from '../../shared/types';
import fetchNui from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';
import { MockedCreator } from '../utils/mocks';

export const userAtom = atom<User | null>({
  key: 'npwd-blackmarket:user',
  default: selector<User | null>({
    key: 'npwd-blackmarket:defaultUser',
    get: async () => {
      try {
        const user = await fetchNui<User>(ListingsEvents.GetUser);

        if (!user) {
          console.log('no response data (user)');
          return null;
        }

        return user;
      } catch {
        if (isEnvBrowser()) {
          return MockedCreator;
        }

        return null;
      }
    },
  }),
});