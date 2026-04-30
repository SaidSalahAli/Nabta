import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Fade, Button } from '@mui/material';
import img from 'assets/images/test.jpeg';
import EpisodeSwiper from '../../../../../components/EpisodeSwiper';

export default function Episodes({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setChecked(true);
    }
  }, [shouldAnimate]);

  const episodes = [
    { id: 1, title: 'عنوان الحلقة', image: img, watch: 'شاهد' },
    { id: 2, title: 'عنوان الحلقة', image: img, watch: 'شاهد' },
    { id: 3, title: 'عنوان الحلقة', image: img, watch: 'شاهد' },
    { id: 4, title: 'عنوان الحلقة', image: img, watch: 'شاهد' },
    { id: 5, title: 'عنوان الحلقة', image: img, watch: 'شاهد' }
  ];

  return (
    <Fade in={checked} timeout={800}>
      <Box sx={{ py: 4, width: '100%' }}>
        <Container maxWidth="lg">
          {/* Title Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              الحلقات
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '18px' }}>
              حلقات متخصصة لأولياء الأمور والمعلمين والآباء والأمهات
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
