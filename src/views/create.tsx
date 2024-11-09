import { ErrorRounded, ImageRounded, RefreshRounded } from '@mui/icons-material';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
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
import { Listing, CreateListingInput } from '../../shared/types';
import { listingsAtom } from '../atoms/listings';
import { userAtom } from '../atoms/user';
import PresentationCard from '../components/PresentationCard';
import { useLocaleStorageState } from '../hooks/useLocaleStorageState';
import fetchNui from '../utils/fetchNui';
import { MockedCreator } from '../utils/mocks';

const initialValues: CreateListingInput = {
  title: '',
  description: '',
  body: '',
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

  const params = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { getValues, control, handleSubmit, setValue, reset } = useForm<CreateListingInput>({
    defaultValues,
  });

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

  const handleGetImage = () => {
    history.push(`/camera?referal=${path}/create`);
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
            waypoint: {
              x: 0,
              y: 0,
            },
          }}
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
          name="image"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Image"
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleGetImage}>
                      <ImageRounded />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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

        <Controller
          name="body"
          control={control}
          rules={{
            required: {
              message: 'Required field',
              value: true,
            },
            minLength: {
              message: 'Min length 50',
              value: 50,
            },
            maxLength: {
              message: 'Max length 3000',
              value: 3000,
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              placeholder="Body"
              fullWidth
              variant="outlined"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? ''}
              rows={6}
              multiline
              {...field}
            />
          )}
        />

        <Stack spacing={0.5}>
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

            <FormControlLabel
              label="Display your location"
              control={
                <Controller
                  name="isPosition"
                  control={control}
                  render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />
              }
            />
          </FormGroup>
        </Stack>

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