import { Box, Container } from '@mui/material';
import React from 'react';
import Hero from './components/hero';
import Applications from './components/applications';
import Characters from './components/characters';
import Worksheets from './components/work-sheets';
import WhyNabta from './components/why-nabta';
import imgbg from 'assets/images/test2.png';
import AboutNabta from './components/about-nabta';
import Episodes from './components/Episodes';

export default function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      <Hero shouldAnimate={true} />
      <Episodes shouldAnimate={true} />
      <Characters shouldAnimate={true} />
      <Worksheets shouldAnimate={true} />
      <WhyNabta shouldAnimate={true} />
      <Applications shouldAnimate={true} />
      <AboutNabta shouldAnimate={true} />
    </Box>
  );
}
