var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/server.ts
var server_exports = {};
__export(server_exports, {
  QBCore: () => QBCore
});
module.exports = __toCommonJS(server_exports);
var exp = global.exports;
var QBCore = null;
var FRAMEWORK = "standalone";
if (GetResourceState("qb-core") === "started") {
  FRAMEWORK = "qb";
}
switch (FRAMEWORK) {
  case "qb":
    QBCore = exp["qb-core"].GetCoreObject();
    break;
}
global.source = 1;
var hotReloadConfig = {
  resourceName: GetCurrentResourceName(),
  files: ["/dist/server.js", "/dist/client.js", "/dist/html/index.js"]
};
if (GetResourceState("hotreload") === "started") {
  global.exports["hotreload"].add(hotReloadConfig);
}
var Store = {
  Listings: [],
  Reports: {}
};
setTimeout(() => {
  if (GetResourceState("npwd") == "started") {
    emitNet("npwd-blackmarket:updateNUI" /* UpdateNUI */, -1);
  }
}, 200);
var getPlayerBySource = (source2, withPhoneNumber) => {
  if (FRAMEWORK === "qb") {
    const player = QBCore.Functions.GetPlayer(source2);
    if (!player) {
      throw new Error("Player could not be found");
    }
    const { citizenid, charinfo } = player.PlayerData;
    return {
      citizenId: citizenid,
      name: `${charinfo.firstname} ${charinfo.lastname}`,
      phoneNumber: withPhoneNumber ? charinfo.phone.toString() : ""
    };
  }
};
onNet("npwd-blackmarket:getUser" /* GetUser */, (responseEvent) => {
  const src = source;
  const user = getPlayerBySource(src);
  setImmediate(() => {
    emitNet(responseEvent, src, { status: "ok", data: user });
  });
});
onNet("npwd-blackmarket:getListings" /* GetListings */, async (responseEvent) => {
  const src = source;
  const listings = Store.Listings.filter((listing) => !listing.deletedAt);
  await new Promise((resolve) => setTimeout(resolve, 2e3));
  setImmediate(() => {
    emitNet(responseEvent, src, { status: "ok", data: listings });
  });
});
onNet(
  "npwd-blackmarket:createListing" /* CreateListing */,
  (responseEvent, data) => {
    const src = source;
    const user = getPlayerBySource(src, data.isCallable);
    const newListing = {
      ...data,
      id: Store.Listings.length,
      creator: user
    };
    Store.Listings.push(newListing);
    setImmediate(() => {
      emitNet("npwd-blackmarket:updateNUI" /* UpdateNUI */, -1);
      emitNet(responseEvent, src, { status: "ok", data: newListing });
    });
  }
);
onNet(
  "npwd-blackmarket:deleteListing" /* DeleteListing */,
  (responseEvent, data) => {
    const src = source;
    const { listingId } = data;
    const user = getPlayerBySource(src);
    const listing = Store.Listings.find((adv) => adv.id === listingId);
    if (!listing) {
      setImmediate(() => {
        emitNet(responseEvent, src, {
          status: "error",
          data: false,
          errorMsg: "Could not find the listing!"
        });
      });
      return;
    }
    if (listing.creator?.citizenId !== user.citizenId) {
      setImmediate(() => {
        emitNet(responseEvent, src, {
          status: "error",
          data: false,
          errorMsg: "You are not the creator of this listing"
        });
      });
      return;
    }
    const newListings = Store.Listings.filter((adv) => adv.id !== listingId);
    Store.Listings = [...newListings, { ...listing, deletedAt: Date.now() }];
    setImmediate(() => {
      emitNet("npwd-blackmarket:updateNUI" /* UpdateNUI */, -1);
      emitNet(responseEvent, src, { status: "ok", data: true });
    });
  }
);
onNet(
  "npwd-blackmarket:reportListing" /* ReportListing */,
  (responseEvent, data) => {
    const src = source;
    const player = getPlayerBySource(src);
    const { listingId, reason } = data;
    const currentReports = Store.Reports[listingId] ?? {};
    const currentReportsForReason = currentReports[reason] ?? {};
    const reportAmount = Object.keys(currentReportsForReason).length;
    const recievedTooManyReports = reportAmount + 1 >= 1;
    if (recievedTooManyReports) {
      console.debug("Deleting listing because of too many reports.");
      deleteListing(listingId);
    } else {
      Store.Reports = {
        ...Store.Reports,
        [listingId]: {
          ...currentReports,
          [reason]: {
            ...currentReportsForReason,
            [player.citizenId]: player
          }
        }
      };
    }
    setImmediate(() => {
      recievedTooManyReports && emitNet("npwd-blackmarket:updateNUI" /* UpdateNUI */, -1);
      emitNet(responseEvent, src, { status: "ok", data: true });
    });
  }
);
function deleteListing(listingId) {
  const listing = Store.Listings.find((adv) => adv.id === listingId);
  if (!listing) {
    throw new Error("Could not find listing");
  }
  const newListings = Store.Listings.filter((adv) => adv.id !== listingId);
  Store.Listings = [...newListings, { ...listing, deletedAt: Date.now() }];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QBCore
});
//# sourceMappingURL=server.js.map
