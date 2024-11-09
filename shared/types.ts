import { ReportReason } from './events';

export interface User {
  name: string;
  citizenId: string;
  phoneNumber?: string;
}

export interface Listing {
  id: number;
  creator: User;

  title: string;
  description: string;
  body: string;

  image?: string;

  phoneNumber?: string;

  isCallable: boolean;
  isPosition: boolean;

  waypoint?: {
    x: number;
    y: number;
  };

  reports?: number;
  deletedAt?: number;
}

export type CreateListingInput = Omit<Listing, 'id' | 'creator' | 'phoneNumber'>;

export type ReportListingInput = {
  listingId: Listing['id'];
  reason: ReportReason;
};

export type ListingActionInput = {
  listingId: Listing['id'];
};

export type SetWaypointInput = {
  waypoint: Listing['waypoint'];
};