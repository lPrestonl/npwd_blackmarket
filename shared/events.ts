export enum ListingsEvents {
    GetUser = 'npwd-blackmarket:getUser',
    GetListings = 'npwd-blackmarket:getAdvertisements',
    CreateListing = 'npwd-blackmarket:createAdvertisement',
    ReportListing = 'npwd-blackmarket:reportAdvertisement',
    DeleteListing = 'npwd-blackmarket:deleteAdvertisement',
    UpdateNUI = 'npwd-blackmarket:updateNUI',
  }
  
  export const reportReasons = ['Offensive', 'Nonsense'] as const;
  export type ReportReason = typeof reportReasons[number];