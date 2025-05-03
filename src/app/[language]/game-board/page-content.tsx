"use client";
import Button from "@mui/material/Button";
import * as React from 'react';
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvide, useFormState } from "react-hook-form";
import {
  useAuthLoginService,
  useAuthSignUpService,
} from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import FormCheckboxInput from "@/components/form/checkbox/form-checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import SocialAuth from "@/services/social-auth/social-auth";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import { isFacebookAuthEnabled } from "@/services/social-auth/facebook/facebook-config";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState, useEffect } from "react";
import {Parallax} from '@react-spring/parallax'
import * as THREE from 'three';
import {Canvas,useFrame} from "@react-three/fiber";
import {OrbitControls,Sparkles} from "@react-three/drei";
import {useRef} from "react";
import Synchronize from "ol-ext/interaction/Synchronize";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol-ext/dist/ol-ext.css';
import MapView from "@/components/ol-map/MapView";


const Map1 = ({setMap1Object}) => {

  const map1Container = useRef(null);
  // on component mount create the map and set the map refrences to the state
  useEffect(() => {
      const map1 = new Map({
          layers: [
              new TileLayer({
                  source: new OSM(),
              }),
          ],
          view: new View({
              //Coordinate System: WGS 84 / Pseudo-Mercator-EPSG:3857
              center: [8546575.886939, 2137169.681579], // Longitude, Latitude
              zoom: 6
          }),
      });
      map1.setTarget(map1Container.current);
      setMap1Object(map1);
      // on component unmount remove the map refrences to avoid unexpected behaviour
      return () => {
          map1.setTarget(undefined);
          setMap1Object(null);
      };
  }, []);
  return ( < Container ><Box ref = { map1Container }className = "absolute inset-0" >      </Box> </Container >
  );
}
const Map2 = ({setMap2Object}) => {

  const map2Container = useRef(null);
  // on component mount create the map and set the map refrences to the state
  useEffect(() => {
      const map2 = new Map({
          layers: [
              new TileLayer({
                  source: new OSM(),
              }),
          ],
          view: new View({
              //Coordinate System: WGS 84 / Pseudo-Mercator-EPSG:3857
              center: [8546575.886939, 2137169.681579], // Longitude, Latitude
              zoom: 6
          }),
      });
      map2.setTarget(map2Container.current);
      setMap2Object(map2);
      // on component unmount remove the map refrences to avoid unexpected behaviour
      return () => {
          map2.setTarget(undefined);
          setMap2Object(null);
      };
  }, []);
  return ( < Container > < Box ref = { map2Container } className = "absolute inset-0" > </Box> </Container >
  );
}

function MapLayer() {
  const [map1Object, setMap1Object] = useState(null);
  const [map2Object, setMap2Object] = useState(null);
  // use synchronize from 0l-ext to sync both the maps
  useEffect(() => {
    if(!map1Object && !map2Object) return;
    var synchronize_12 = new Synchronize({ maps: [map2Object] });
    var synchronize_21 = new Synchronize({ maps: [map1Object] });
    map1Object?.addInteraction( synchronize_12 );
    map2Object?.addInteraction( synchronize_21 );
    return () => {
      if(map1Object) map1Object.removeInteraction(synchronize_12);
      if(map2Object) map2Object.removeInteraction(synchronize_21);
    }
  }, [map1Object, map2Object])
  return (
    <div className="flex h-[100vh] gap-[2px] bg-white/70" >
      <div className='relative w-1/2   border border-transparent'>
        <Map1 setMap1Object={setMap1Object}/>
      </div>
      <div className='relative w-1/2 border border-transparent'>
        <Map2 setMap2Object={setMap2Object}/>
      </div>
    </div>
  );
}

function Porfo() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (

      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const { t } = useTranslation("sign-up");

  return (  
    <Container>
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <MapLayer/>
   </Container>
  );
}

function Portfolio() {
  return <Porfo />;
}


export default Portfolio;
