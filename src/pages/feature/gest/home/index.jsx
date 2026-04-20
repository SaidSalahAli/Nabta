import { Box, Container } from '@mui/material';
import React from 'react';
import Hero from './components/hero';
import Episodes from './components/Episodes';

export default function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      <Hero shouldAnimate={true} />
      <Episodes shouldAnimate={true} />
    </Box>
  );
}
