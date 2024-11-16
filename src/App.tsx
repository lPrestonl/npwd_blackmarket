import React, { useEffect, useState } from 'react';

import { i18n } from 'i18next';
import {
  Theme,
  Paper,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  StyledEngineProvider,
} from '@mui/material';
import Header, { HEADER_HEIGHT } from './components/Header';
import styled from '@emotion/styled';
import { Link, NavLink, Route, useHistory, useLocation } from 'react-router-dom';
import { path } from '../npwd.config';
import { Add, FormatListBulletedRounded, Person2Rounded } from '@mui/icons-material';
import ThemeSwitchProvider from './ThemeSwitchProvider';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import Listings from './views/listings';
import { useNuiEvent } from './hooks/useNuiEvent';
import { listingsAtom } from './atoms/listings';
import fetchNui from './utils/fetchNui';
import { ServerPromiseResp } from './types/common';
import { Listing } from '../shared/types';
import { ListingsEvents } from '../shared/events';
import Create from './views/create';


const Container = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-height: 100%;
`;

const LinkItem = styled(Link)`
  font-family: sans-serif;
  text-decoration: none;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem;
  max-height: calc(100% - 3.5rem - ${HEADER_HEIGHT});
  overflow: auto;
`;

const Footer = styled.footer`
  margin-top: auto;
`;

interface AppProps {
  theme: Theme;
  i18n: i18n;
  settings: any;
}

export function App(props: AppProps) {
  
  const setListings = useSetRecoilState(listingsAtom);
  const history = useHistory();
  const { pathname } = useLocation();
  const [nuiData, setNuiData] = useState(null);

  const [page, setPage] = useState(pathname);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetchNui<ServerPromiseResp<Listing[]>>(
          ListingsEvents.GetListings
        );
        console.log(response);
  
        // Check if the response is successful and contains data
        if (response.status === 'ok' && Array.isArray(response.data)) {
          setListings(response.data); // Set the listings
          console.log('BlackMarket Listings fetched successfully!');
        } else {
          console.error('No data found or error in response:', response);
        }
      } catch (error) {
        console.error('Error fetching BlackMarket Listings:', error);
      }
    };
  
    fetchListings();
  
    return () => {};
  }, [ListingsEvents.UpdateNUI]);
  
  const handleChange = (_e: any, newPage: any) => {};

  return (
    <StyledEngineProvider injectFirst>
      <ThemeSwitchProvider mode={props.theme.palette.mode}>
        <Container square elevation={0}>
          <Header>Black Market</Header>
          <Content>
          <Route exact path={path}>
              <Listings />
            </Route>
            <Route path={`${path}/create`}>
              <Create />
            </Route>
          </Content>

          <BottomNavigation value={page} onChange={handleChange} showLabels>
            <BottomNavigationAction
              label={'New Post'}
              value={`${path}/create`}
              color="secondary"
              icon={<Add />}
              component={NavLink}
              to={`${path}/create`}
            />
            <BottomNavigationAction
              label={'Listings'}
              value={path}
              icon={<FormatListBulletedRounded />}
              component={NavLink}
              to={path}
            />
            <BottomNavigationAction
              label={'Account'}
              value={`${path}/account`}
              color="secondary"
              icon={<Person2Rounded />}
              component={NavLink}
              to={`${path}/account`}
            />
          </BottomNavigation>
        </Container>
      </ThemeSwitchProvider>
    </StyledEngineProvider>
  );
}

export default function WithProviders(props: AppProps) {
  return (
    <RecoilRoot override key="">
      <App {...props} />
    </RecoilRoot>
  );
}
