import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Fade, Button } from '@mui/material';
import img from 'assets/images/test.jpeg';
import EpisodeSwiper from '../../../../../components/EpisodeSwiper';
// import imgbg from 'assets/images/test2.png';
export default function PartnersReviews({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setChecked(true);
    }
  }, [shouldAnimate]);

  const episodes = [
    { id: 1, title: 'عنوان النطبيق', image: img },
    { id: 2, title: 'عنوان التطبيق', image: img },
    { id: 3, title: 'عنوان التطبيق', image: img },
    { id: 4, title: 'عنوان التطبيق', image: img },
    { id: 5, title: 'عنوان التطبيق', image: img }
  ];

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          py: 4,
          width: '100%'
          // backgroundColor: '#aeedd9'
          // backgroundImage: `url(${imgbg})`,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center'
        }}
      >
        <Container maxWidth="lg">
          {/* Title Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontWeight: 700, color: 'black', mb: 1 }}>
              ماذا قالوا عنا؟
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '18px' }}>
              أراء بعض من شركاؤنا االستراتيجيين من عمًلئنا الكرام في أعمالنا ومنتجاتنا اإلبداعية والتي نفخر بها{' '}
            </Typography>
          </Box>

          {/* Episodes Swiper */}
          <EpisodeSwiper episodes={episodes} isAnimating={checked} />

          {/* View All Link */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { '& .view-all-text': { color: '#006699' } }
            }}
          >
            <Button
              variant="contained"
              sx={{
                px: 2,
                py: 1,
                borderRadius: '18px',
                fontSize: { xs: '18px', md: '15px' },
                fontWeight: 700,
                backgroundColor: '#FFD666',
                color: '#2E2A39',
                boxShadow: '0 10px 25px rgba(255, 214, 102, 0.35)',
                '&:hover': {
                  backgroundColor: '#ffcf4d'
                }
              }}
            >
              المزيد ...
            </Button>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}
