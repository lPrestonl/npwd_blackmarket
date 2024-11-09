import { atom, selector } from 'recoil';
import { ListingsEvents } from '../../shared/events';
import { Listing, User } from '../../shared/types';
import fetchNui from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';
import { MockedListings, MockedCreator } from '../utils/mocks';

export const listingsAtom = atom<Listing[]>({
  key: 'npwd-listings:listings',
  default: selector<Listing[]>({
    key: 'npwd-listings:defaultListings',
    get: async () => {
      try {
        const listings = await fetchNui<Listing[]>(
          ListingsEvents.GetListings,
        );

        if (!listings) {
          console.log('no response data (listings)');
          return [];
        }

        return listings;
      } catch (error) {
        console.error(error);
        if (isEnvBrowser()) {
          return MockedListings;
        }

        return [];
      }
    },
  }),
});