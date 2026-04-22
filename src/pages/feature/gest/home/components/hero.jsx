import React, { useState, useEffect } from 'react';
import { Box, useTheme, Fade } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import img from 'assets/images/test.png';

export default function Hero({ shouldAnimate = false }) {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);

  const heroSlides = [
    img,
    img,
    img,
    img,
    img
  ];

  useEffect(() => {
    if (shouldAnimate) setChecked(true);
  }, [shouldAnimate]);

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',

          // ── Pagination bullets ──────────────────────────────
          '& .swiper-pagination-bullet': {
            backgroundColor: theme.palette.grey[400],
            width: 10,
            height: 10,
            borderRadius: '50%',
            opacity: 1,
            margin: '0 4px !important',
            transition: 'width 0.35s ease, background-color 0.35s ease, border-radius 0.35s ease'
          },
          '& .swiper-pagination-bullet-active': {
            backgroundColor: theme.palette.primary.main,
            width: 28,
            height: 10,
            borderRadius: '5px',
            opacity: 1
          },
          '& .swiper-pagination': {
            bottom: '16px !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          modules={[Pagination, Navigation, Autoplay]}
          style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '250px', sm: '350px', md: '500px' },
                  backgroundImage: `url(${slide})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    zIndex: 1
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Fade>
  );
}
