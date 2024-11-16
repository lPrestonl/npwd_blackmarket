import React, { MouseEvent, useState } from 'react';
import {
  Item,
  Listing,
  ListingActionInput,
  ReportListingInput,
} from '../../shared/types';

import {
  CallRounded,
  ChatRounded,
  Close,
  DeleteRounded,
  EditRounded,
  MoreVert,
  PhoneRounded,
  ReportRounded,
  RoomRounded,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
// import ReactMarkdown from 'react-markdown';
import styled from '@emotion/styled';
import fetchNui from '../utils/fetchNui';
import { ListingsEvents, ReportReason, reportReasons } from '../../shared/events';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { listingsAtom } from '../atoms/listings';
import { userAtom } from '../atoms/user';
import { useHistory } from 'react-router-dom';

const StyledCardContent = styled(CardContent)`
  word-break: break-word;
  paddingRight: '16px';
`;

const StyledDialogContent = styled(DialogContent)`
  word-break: break-word;
`;

interface PresentationCardProps {
  listing: Listing;
  selectedItems: Item[]
  isPreview?: boolean;
  onClose?(): void;
}


const PresentationCard = ({ listing, onClose, isPreview, selectedItems }: PresentationCardProps) => {
  const history = useHistory();
  const user = useRecoilValue(userAtom);
  const setListings = useSetRecoilState(listingsAtom);
  const isCreator = listing.creator.citizenId === user?.citizenId;

  const listingId = listing.id;
  const hideCreatorActions = isCreator && !isPreview;
  // console.log({ isCreator, listing, user });

  const [isContentOpen, setIsContentOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<Element>();
  const [reportMenuAnchor, setReportMenuAnchor] = useState<Element>();

  const handleOpenMenu = (event: MouseEvent) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleOpenReportMenu = (event: MouseEvent) => {
    setReportMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(undefined);
  };

  const handleCloseReportMenu = () => {
    setMenuAnchor(undefined);
    setReportMenuAnchor(undefined);
  };

  const handleClose = () => {
    onClose?.();
    setIsContentOpen(false);
  };

  const handleDeleteListing = async () => {
    if (isPreview) return;
    try {
      await fetchNui<boolean, ListingActionInput>(ListingsEvents.DeleteListing, {
        listingId,
      });
      setListings((prev) => prev.filter((adv) => adv.id !== listing.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = async (reason: ReportReason) => {
    if (isPreview) return;
    try {
      await fetchNui<boolean, ReportListingInput>(ListingsEvents.ReportListing, {
        listingId,
        reason,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCall = async () => {
    if (isPreview) return;
    history.push(`/phone/dial?number=${listing.creator.phoneNumber}`);
  };

  const handleChat = () => {
    if (isPreview) return;
    history.push(`/messages/new?phoneNumber=${listing.creator.phoneNumber}`);
  };

  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id: any) => {
    setExpandedId((prevId) => {
      return prevId === id ? null : id;
    });
  };
  
  console.log(listingId)
  return (
    <div>
      <Card elevation={4}>

        <CardActionArea onClick={() => handleExpandClick(listingId)}>
          <>
            {/* {listing.image && (
              <CardMedia height={100} width={100} component="img" image={listing.image} />
            )} */}

            <StyledCardContent>
            <Typography variant="body2" sx={{ paddingLeft: '0px', paddingRight: "17px" }}>
              {listing?.description || 'Missing description'}
            </Typography>
              {/* TODO: When one is open and you open another, close the first one. */}
              {/* <ReactMarkdown
                children={listing.description || 'Missing description'}
                remarkPlugins={[remarkGfm]}
                disallowedElements={['a']}
              /> */}
            <Box
              sx={{
                position: 'absolute',
                top: 13,
                right: 8,
                transition: 'transform 0.3s',
                transform: expandedId ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
          <ExpandMoreIcon />
        </Box>
              <Collapse in={Boolean(expandedId)} timeout="auto" unmountOnExit>
                <CardContent>
                <Divider light />
      <Typography
        variant="body2"
        sx={{
          fontSize: '1rem',
          textAlign: 'center',
          marginLeft: '-18px',
          marginTop: '5px',
          marginBottom: '-30px',
        }}
      >
        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <Typography key={index} sx={{ margin: '5px 0' }}>
              {item.name}
              {/* You can display quantity if needed: */}
              {/* {item.quantity && <span style={{ color: 'grey' }}> x{item.quantity}</span>} */}
            </Typography>
          ))
        ) : (
          'No items selected'
        )}
      </Typography>
                </CardContent>
              </Collapse>
            </StyledCardContent>
          </>
          <Divider light />
        </CardActionArea>
        <CardHeader
          title={listing.title || 'Missing title'}
          subheader={listing?.creator?.name || 'Unknown'}
          action={
              <IconButton onClick={handleOpenMenu}>
                <MoreVert />
              </IconButton>
          }
        />
      </Card>

      <Dialog
        open={isContentOpen}
        onClose={handleClose}
        disablePortal
        hideBackdrop
        fullScreen
        PaperProps={{ elevation: 0, square: true }}
        sx={{ position: 'absolute' }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography variant="h5">{listing?.title || 'Missing title'}</Typography>
              <Typography variant="caption">{listing?.creator?.name || 'Unknown'}</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton onClick={handleOpenMenu}>
                <MoreVert />
              </IconButton>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>

        <Divider />

        {/* <StyledDialogContent>
          {listing?.body || 'Missing content'}

        </StyledDialogContent> */}

        <Divider />

        {(listing.isCallable || listing.isPosition) && (
          <DialogActions>
            <Box p={1} pr={2.5}>
              <Stack direction="row" spacing={1}>
                {!hideCreatorActions && listing?.creator?.phoneNumber && (
                  <>
                    {listing.isCallable && (
                      <>
                        <IconButton onClick={handleChat}>
                          <ChatRounded />
                        </IconButton>
                        <IconButton onClick={handleCall}>
                          <PhoneRounded />
                        </IconButton>
                      </>
                    )}
                  </>
                )}
              </Stack>
            </Box>
          </DialogActions>
        )}
      </Dialog>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        transformOrigin={{ horizontal: 'right', vertical: 'center' }}
      >
        <MenuList disablePadding sx={{ minWidth: 150 }}>
          {!hideCreatorActions && listing.isCallable && (
            <>
              <MenuItem onClick={handleCall}>
                <ListItemIcon>
                  <CallRounded />
                </ListItemIcon>
                <ListItemText>Call</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleChat}>
                <ListItemIcon>
                  <ChatRounded />
                </ListItemIcon>
                <ListItemText>Chat</ListItemText>
              </MenuItem>
            </>
          )}

          {/* {!hideCreatorActions && ( */}
          <>
            <Divider light />
            <MenuItem onClick={handleOpenReportMenu}>
              <ListItemIcon>
                <ReportRounded />
              </ListItemIcon>
              <ListItemText>Report</ListItemText>
            </MenuItem>
          </>
          {/* )} */}

          {isCreator && (
            <>
              <Divider light />
              {/* <MenuItem>
                <ListItemIcon>
                  <EditRounded />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem> */}
              <MenuItem onClick={handleDeleteListing}>
                <ListItemIcon>
                  <DeleteRounded />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>

      <Menu
        anchorEl={reportMenuAnchor}
        open={Boolean(reportMenuAnchor)}
        onClose={handleCloseReportMenu}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        transformOrigin={{ horizontal: 'center', vertical: 'center' }}
      >
        <MenuList disablePadding sx={{ minWidth: 150 }}>
          {reportReasons.map((reason) => (
            <MenuItem key={reason} onClick={() => handleReport(reason)}>
              <ListItemText>{reason}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default PresentationCard;