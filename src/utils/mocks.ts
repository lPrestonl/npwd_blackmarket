import { Listing, User } from '../../shared/types';

const markdown1 = `Testing1`;

const markdown = `PD Rifle <p style={{ color: 'grey' }}>x1</p> \n PD Pistol <p style={{ color: 'grey' }}>x1</p>`;

const description = `
  I got some shit to unload. Call me to make a deal.
`;

export const MockedCreator: User = {
  name: 'Anonymous',
  citizenId: 'y121asdk',
};

export const MockedListings: Listing[] = [
  {
    id: 1,
    title: 'PD Weapons',
    description: description,
    body: [
      { name: 'PD Rifle', quantity: 1 },
      { name: 'PD Pistol', quantity: 1 },
    ],
    creator: MockedCreator,
    phoneNumber: '072-12312',
    isCallable: true,
    isPosition: false,
  },
  // {
  //   id: 2,
  //   title: 'Other services',
  //   description: markdown,
  //   body: [
  //     { name: 'PD Rifle', quantity: 1 },
  //     { name: 'PD Pistol', quantity: 1 },
  //   ],
  //   creator: MockedCreator,
  //   phoneNumber: '072-12312',
  //   isCallable: true,
  //   isPosition: false,
  // },
  // {
  //   id: 3,
  //   title: 'Car repairs AB',
  //   description: `Come get repairs, expensive af.`,
  //   body: [
  //     { name: 'PD Rifle', quantity: 1 },
  //     { name: 'PD Pistol', quantity: 1 },
  //   ],
  //   creator: MockedCreator,
  //   phoneNumber: '072-12312',
  //   isCallable: true,
  //   isPosition: false,
  // },
];