import { Listing, User } from '../../shared/types';

const markdown1 = `Testing1`;

const markdown = `Testing`;

const description = `
  ### Taxi service for the people
  Welcome and take a ride in **my** car!
`;

export const MockedCreator: User = {
  name: 'James Fisher',
  citizenId: 'y121asdk',
};

export const MockedListings: Listing[] = [
  {
    id: 1,
    title: 'Taxi service',
    description: description,
    body: markdown,
    creator: MockedCreator,
    phoneNumber: '072-12312',
    isCallable: true,
    isPosition: false,
  },
  {
    id: 2,
    title: 'Other services',
    description: `This is a short description displaying this *feature*. It's using **markdown** as well.`,
    body: markdown1,
    creator: MockedCreator,
    phoneNumber: '072-12312',
    isCallable: true,
    isPosition: false,
  },
  {
    id: 3,
    title: 'Car repairs AB',
    description: `Come get repairs, expensive af.`,
    body: markdown1,
    creator: MockedCreator,
    phoneNumber: '072-12312',
    isCallable: true,
    isPosition: false,
  },
];