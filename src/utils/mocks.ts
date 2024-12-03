import { Listing, User } from '../../shared/types';

const description = `I got some shit to unload. Call me to make a deal.`;

export const MockedCreator: User = {
  name: 'Anonymous',
  citizenId: 'y121asdk',
};

export const MockedListings: Listing[] = [
  {
    id: 1,
    title: 'PD Weapons',
    description: description,
    body: [],
    creator: MockedCreator,
    phoneNumber: '072-12312',
    isCallable: true,
    isPosition: false,
  },
];