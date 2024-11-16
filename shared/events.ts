export enum ListingsEvents {
    GetUser = 'npwd-blackmarket:getUser',
    GetListings = 'npwd-blackmarket:getListings',
    CreateListing = 'npwd-blackmarket:createListing',
    ReportListing = 'npwd-blackmarket:reportListing',
    DeleteListing = 'npwd-blackmarket:deleteListing',
    UpdateNUI = 'npwd-blackmarket:updateNUI',
  }
  
  export const reportReasons = ['Offensive', 'Nonsense'] as const;
  export type ReportReason = typeof reportReasons[number];