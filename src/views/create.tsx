import { ErrorRounded, RefreshRounded } from '@mui/icons-material';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { TextField } from '../components/Input'
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { path } from '../../npwd.config';
import { ListingsEvents } from '../../shared/events';
import { Listing, CreateListingInput, Item } from '../../shared/types';
import { listingsAtom } from '../atoms/listings';
import { userAtom } from '../atoms/user';
import PresentationCard from '../components/PresentationCard';
import { useLocaleStorageState } from '../hooks/useLocaleStorageState';
import fetchNui from '../utils/fetchNui';
import { MockedCreator } from '../utils/mocks';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

// TODO: Add useeffect to pull items. This makes it so everytime you go to the create tab it pulls a new list of inventory items.

const items: Item[] = [
  { name: 'PD Rifle' },
  { name: 'PD SMG' },
  { name: 'PD Pistol' },
  { name: 'Handcuffs' },
  { name: 'Bikini Tow Plushie' },
];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const initialValues: CreateListingInput = {
  title: '',
  description: '',
  body: [],
  image: '',
  isCallable: false,
  isPosition: false,
};

const Create = () => {
  const history = useHistory();
  const user = useRecoilValue(userAtom);
  const updateListings = useSetRecoilState(listingsAtom);

  const [defaultValues, setDefaultValues] = useLocaleStorageState<CreateListingInput>(
    'npwd-create-listing',
    initialValues,
  );

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { getValues, control, handleSubmit, setValue, reset } = useForm<CreateListingInput>({
    defaultValues,
  });

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const handleItemChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
  
    // Check if the value is an array of selected item names
    const selectedNames = value as string[];
  
    // Create a map to count the occurrences of each item name
    const itemMap = new Map<string, number>();
  
    selectedNames.forEach((name) => {
      itemMap.set(name, (itemMap.get(name) || 0) + 1);
    });
  
    const updatedItems: Item[] = Array.from(itemMap.entries()).map(([name, quantity]) => {
      const matchingItem = items.find((item) => item.name === name);
  
      if (matchingItem) {
        return { ...matchingItem, quantity };
      }
  
      return null; 
    }).filter(item => item !== null) as Item[]; 
  
    setSelectedItems(updatedItems);

    console.log('Updated selected items:', updatedItems);
  };


  useEffect(() => {
    const image = query.get('image') || defaultValues.image;
    setValue('image', image);
    return () => {
      const vals = getValues();
      setDefaultValues(vals);
    };
  }, []);

  const onSubmit = async (values: CreateListingInput) => {
    setIsLoading(true);

    try {
      const newListing = await fetchNui<Listing, CreateListingInput>(
        ListingsEvents.CreateListing,
        values,
      );

      updateListings((prev) => [...prev, newListing]);
      reset(initialValues);

      history.push(path);
      setError('');
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };


  if (isPreview) {
    return (
      <>
        <PresentationCard
          isPreview
          listing={{
            ...getValues(),
            id: -1,
            creator: MockedCreator,
            phoneNumber: user?.phoneNumber ?? 'Unknown',
          }}
          selectedItems={selectedItems}
        />
  
        <Box sx={{ position: 'absolute', bottom: '4.5rem', right: '1.5rem' }}>
          <Fab sx={{ color: '#fff' }} onClick={() => setIsPreview(false)} variant="extended">
            Close preview
          </Fab>
        </Box>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={0.5}>
        <Typography variant="h5">New listing</Typography>
        {/* <Typography variant="caption">
          You can edit your listing from the listings view
        </Typography> */}
      </Stack>
      <Divider sx={{ margin: '1.5rem 0' }} />

      <Stack spacing={2}>
        <Controller
          name="title"
          control={control}
          rules={{
            required: {
              message: 'Required field',
              value: true,
            },
            minLength: {
              message: 'Min length 3',
              value: 3,
            },
            maxLength: {
              message: 'Max length 20',
              value: 20,
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              placeholder="Title"
              variant="outlined"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? ''}
              {...field}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            required: {
              message: 'Required field',
              value: true,
            },
            minLength: {
              message: 'Min length 15',
              value: 15,
            },
            maxLength: {
              message: 'Max length 100',
              value: 100,
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              placeholder="Description"
              variant="outlined"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? ''}
              rows={3}
              multiline
              {...field}
            />
          )}
        />
          {/* TODO: Update to allow selection of items for the listing. */}
          {/* Three fields per item. Select the item from inventory (To get name). Price. Currancy. */}
          {/* exports.ox_inventory:GetPlayerItems() */}
          <Controller
            name="body"
            control={control}
            rules={{
              validate: {
                hasItems: (value) => {
                  // Check if selectedItems is an array with at least one item
                  if (selectedItems.length === 0) {
                    return 'Please select at least one item.';
                  }
                  return true;  // Valid input, no error
                },
              },
            }}
            render={({ field, fieldState }) => (
              <FormControl error={Boolean(fieldState.error)}>
                <InputLabel id="demo-multiple-name-label">Items</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={selectedItems.map(item => item.name)} // Binding state to the value
                  onChange={handleItemChange}
                  input={<OutlinedInput label="Items" />}
                  MenuProps={MenuProps}
                >
                  {items.map((itemOption) => (
                    <MenuItem key={itemOption.name} value={itemOption.name}>
                      {itemOption.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

        {/* <Stack spacing={0.5}>
          <FormGroup>
            <FormControlLabel
              label="Show phone number"
              control={
                <Controller
                  name="isCallable"
                  control={control}
                  render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />
              }
            />

          </FormGroup>
        </Stack> */}

        {error && (
          <Alert
            icon={isLoading ? <RefreshRounded /> : <ErrorRounded />}
            color={isLoading ? 'info' : 'error'}
            variant="outlined"
          >
            {isLoading ? 'Loading ..' : error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setIsPreview(true)}
          disabled={isLoading}
        >
          Preview
        </Button>

        <Button sx={{ color: '#fff' }} fullWidth variant="contained" type="submit" disabled={isLoading}>
          Publish
        </Button>
      </Stack>
    </form>
  );
};

export default Create;