// TODO: Make accounts page.

import { UpdateUserInput, User } from "../../shared/types";
import { Box } from '@mui/material';
import { TextField } from '../components/Input'
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { path } from '../../npwd.config';
import { userAtom } from '../atoms/user';
import fetchNui from '../utils/fetchNui';
import { MockedCreator } from '../utils/mocks';
import { useRecoilState, useRecoilValue } from "recoil";
import { ListingsEvents } from "../../shared/events";


const initialValues: User = {
    name: 'Anonymous',
    citizenId: '',
    phoneNumber: '',
  };

const Account = () => {
    const history = useHistory();
    

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const onSubmit = async (newName: string) => {
        setIsLoading(true);
        setError('');
      
        try {
          const updatedUser = await fetchNui<User, { name: string }>(
            ListingsEvents.UpdateUser,
            { name: newName }
          );
      
          if (!updatedUser) {
            throw new Error('Failed to update username.');
          }
      
          (updatedUser);
          history.push(path);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      

}
export default Account;