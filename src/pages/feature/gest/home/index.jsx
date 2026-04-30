import { Box } from '@mui/material';
import React from 'react';
import Hero from './components/hero';
import Applications from './components/applications';
import Characters from './components/characters';
import Worksheets from './components/work-sheets';
import WhyNabta from './components/why-nabta';
import AboutNabta from './components/about-nabta';
import Episodes from './components/Episodes';
// import Partners from './components/partners';
import NabtaNumbers from './components/nabta-numbers';
import PartnersReviews from './components/partners-reviews';
import Partners from './components/partners';
import Team from './components/team';
import GoalsPrinciples from './components/goals-Principles';

export default function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      <Hero shouldAnimate={true} />
      <Episodes shouldAnimate={true} />
      <Characters shouldAnimate={true} />
      <Worksheets shouldAnimate={true} />
      <WhyNabta shouldAnimate={true} />
      <GoalsPrinciples shouldAnimate={true} />

      <NabtaNumbers shouldAnimate={true} />
      <Applications shouldAnimate={true} />
      <AboutNabta shouldAnimate={true} />
      <PartnersReviews shouldAnimate={true} />
      <Partners shouldAnimate={true} />
      <Team shouldAnimate={true} />
    </Box>
  );
}
