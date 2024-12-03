import { SelectChangeEvent, Stack } from '@mui/material';
import { SearchField } from '../components/SearchField';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { listingsAtom } from '../atoms/listings';
import PresentationCard from '../components/PresentationCard';
import { Item } from '../../shared/types';

const Listings = () => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const listings = useRecoilValue(listingsAtom);
  const [search, setSearch] = useState('');

  const filteredListing = listings.filter((listing) =>
    listing.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Stack spacing={1.5}>
        <SearchField
          placeholder="Search .."
          value={search}
          onChange={(event: any) => setSearch(event.target.value)}
        />

        {filteredListing.map((listing) => (
          <PresentationCard listing={listing} key={listing.id} selectedItems={selectedItems} />
        ))}
      </Stack>
    </div>
  );
};

export default Listings;