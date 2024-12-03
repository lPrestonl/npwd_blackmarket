import { Key } from 'react';
import { ReportReason } from './events';

export interface User {
  name: string;
  citizenId: string;
  phoneNumber?: string;
}

export interface Item {
  name: string;
  quantity?: number;
}

export interface Listing {
  id: number;
  creator: User;

  title: string;
  description: string;
  body: [];

  image?: string;

  phoneNumber?: string;

  isCallable: boolean;
  isPosition: boolean;

  reports?: number;
  deletedAt?: number;
}

export type CreateListingInput = Omit<Listing, 'id' | 'creator' | 'phoneNumber'>;

export type UpdateUserInput = Omit<User, 'citizenId' | 'phoneNumber'>

export type ReportListingInput = {
  listingId: Listing['id'];
  reason: ReportReason;
};

export type ListingActionInput = {
  listingId: Listing['id'];
};
