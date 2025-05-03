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

const RotatingCube = () => {
  const meshRef = useRef(null);
  useFrame(  ()  => {
    if(meshRef.current) {
      meshRef.current.rotation.y += 0.01
      
      meshRef.current.rotation.x += 0.01
    }
  })
  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="#468585" emissive="#468585" />
    </mesh> 
  )
}
function Counter() {
  const [count, setCount] = useState(1);
  const [calculation, setCalculation] = useState(0);
  const containerRef = React.useRef(null);
/*
  const scene:THREE.Scene = new THREE.Scene();
  scene.background = new THREE.Color('#FOFOFOQ');
  const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.z=5;
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color: '#468585',emissive:'#4685558'})
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  // 4. Add lighting
  const light = new THREE.DirectionalLight(0x9CDBA6, 10);
  light.position.set(1, 1, 1);
  scene.add(light);
  // 5. Set up the renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 400);
  // 6. Animate the scene
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  console.log("Appending in DOM");
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.appendChild(renderer.domElement);
      animate();
    }
    setCalculation((calculation)=>calculation +1);

    return()=>{
      console.log("Removing in DOM.");
     container.removeChild(renderer.domElement);
    }
  },[count]); // <- add the count variable here
*/
  return (
   
   
    <Canvas style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <OrbitControls enableZoom enablePan enableRotate />

      <directionalLight position={[1, 1, 1]} intensity={10} color={"0x9CDBA6"} />
      <RotatingCube/>
      <color attach="background" args={['#FOFOFQ']} />
      <Sparkles count={100} scale={1} size={2} speed={0.2} noise={0.1}
color="orange" />
      {/* <p>Count: {count}</p>
      <button onClick={() => setCount((count) => count + 1)}>+</button>
      <p>Calculation: {calculation}</p>
      <div ref={containerRef} ></div> */}
    </ Canvas>
   

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
      <Counter/>
   </Container>
  );
}

function Portfolio() {
  return <Porfo />;
}


export default Portfolio;
