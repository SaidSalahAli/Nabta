import { Box, Container } from '@mui/material';
import React from 'react';
import Hero from './components/hero';
import Episodes from './components/Episodes';
import Applications from './components/applications';
import Characters from './components/characters';
import Worksheets from './components/Worksheets';
import imgbg from 'assets/images/test2.png';
import AboutNabta from './components/aboutNabta';

export default function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      <Hero shouldAnimate={true} />
      <Episodes shouldAnimate={true} />
      <Characters shouldAnimate={true} />
      <Applications shouldAnimate={true} />
      <Worksheets shouldAnimate={true} />
      <AboutNabta shouldAnimate={true} />
    </Box>
  );
}
