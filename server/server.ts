import { ListingsEvents, ReportReason } from '../shared/events';
import {
  Listing,
  ReportListingInput,
  CreateListingInput,
  User,
} from '../shared/types';

import { Server as QBServer } from 'qbcore.js';

const exp = global.exports;

export let QBCore: QBServer = null;

let FRAMEWORK: 'qb' | 'standalone' = 'standalone';

if (GetResourceState('qb-core') === 'started') {
  FRAMEWORK = 'qb';
}


switch (FRAMEWORK) {
  case 'qb':
    QBCore = exp['qb-core'].GetCoreObject();
    break;
}


global.source = 1;

const hotReloadConfig = {
  resourceName: GetCurrentResourceName(),
  files: ['/dist/server.js', '/dist/client.js', '/dist/html/index.js'],
};

if (GetResourceState('hotreload') === 'started') {
  global.exports['hotreload'].add(hotReloadConfig);
};

type ReportStore = {
  [index in ReportReason]: Record<string, User>;
};

interface IStore {
  Listings: Listing[];
  Reports: Record<Listing['id'] | undefined, ReportStore>;
}

const Store: IStore = {
  Listings: [] as Listing[],
  Reports: {},
};

setTimeout(() => {
  if (GetResourceState('npwd') == 'started') {
    emitNet(ListingsEvents.UpdateNUI, -1);
  }
}, 200);

const getPlayerBySource = (source: number, withPhoneNumber?: boolean): User => {
  if (FRAMEWORK === 'qb') {
    const player = QBCore.Functions.GetPlayer(source);

    if (!player) {
      throw new Error('Player could not be found');
    }

    const { citizenid, charinfo } = player.PlayerData;

    return {
      citizenId: citizenid,
      name: `${charinfo.firstname} ${charinfo.lastname}`,
      phoneNumber: withPhoneNumber ? charinfo.phone.toString() : '',
    };
  }
};

onNet(ListingsEvents.GetUser, (responseEvent: string) => {
  const src = source;
  const user = getPlayerBySource(src);

  setImmediate(() => {
    emitNet(responseEvent, src, { status: 'ok', data: user });
  });
});

onNet(ListingsEvents.GetListings, async (responseEvent: string) => {
  const src = source;
  const listings = Store.Listings.filter((listing) => !listing.deletedAt);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  setImmediate(() => {
    emitNet(responseEvent, src, { status: 'ok', data: listings });
  });
});

onNet(
  ListingsEvents.CreateListing,
  (responseEvent: string, data: CreateListingInput) => {
    const src = source;
    const user = getPlayerBySource(src, data.isCallable);

    const newListing: Listing = {
      ...data,
      id: Store.Listings.length,
      creator: user,
    };

    Store.Listings.push(newListing);

    setImmediate(() => {
      emitNet(ListingsEvents.UpdateNUI, -1);
      emitNet(responseEvent, src, { status: 'ok', data: newListing });
    });
  },
);

onNet(
  ListingsEvents.DeleteListing,
  (responseEvent: string, data: { listingId: number }) => {
    const src = source;
    const { listingId } = data;

    const user = getPlayerBySource(src);
    const listing = Store.Listings.find((adv) => adv.id === listingId);

    if (!listing) {
      setImmediate(() => {
        emitNet(responseEvent, src, {
          status: 'error',
          data: false,
          errorMsg: 'Could not find the listing!',
        });
      });
      return;
    }

    if (listing.creator?.citizenId !== user.citizenId) {
      setImmediate(() => {
        emitNet(responseEvent, src, {
          status: 'error',
          data: false,
          errorMsg: 'You are not the creator of this listing',
        });
      });
      return;
    }

    const newListings = Store.Listings.filter((adv) => adv.id !== listingId);
    Store.Listings = [...newListings, { ...listing, deletedAt: Date.now() }];

    setImmediate(() => {
      emitNet(ListingsEvents.UpdateNUI, -1);
      emitNet(responseEvent, src, { status: 'ok', data: true });
    });
  },
);

onNet(
  ListingsEvents.ReportListing,
  (responseEvent: string, data: ReportListingInput) => {
    const src = source;
    const player = getPlayerBySource(src);
    const { listingId, reason } = data;

    const currentReports = Store.Reports[listingId] ?? ({} as ReportStore);
    const currentReportsForReason = currentReports[reason] ?? {};
    const reportAmount = Object.keys(currentReportsForReason).length;

    const recievedTooManyReports = reportAmount + 1 >= 1;

    if (recievedTooManyReports) {
      console.debug('Deleting listing because of too many reports.');
      deleteListing(listingId);
    } else {
      Store.Reports = {
        ...Store.Reports,
        [listingId]: {
          ...currentReports,
          [reason]: {
            ...currentReportsForReason,
            [player.citizenId]: player,
          },
        },
      };
    }

    setImmediate(() => {
      recievedTooManyReports && emitNet(ListingsEvents.UpdateNUI, -1);
      emitNet(responseEvent, src, { status: 'ok', data: true });
    });
  },
);

function deleteListing(listingId: number) {
  const listing = Store.Listings.find((adv) => adv.id === listingId);

  if (!listing) {
    throw new Error('Could not find listing');
  }

  const newListings = Store.Listings.filter((adv) => adv.id !== listingId);
  Store.Listings = [...newListings, { ...listing, deletedAt: Date.now() }];
}
