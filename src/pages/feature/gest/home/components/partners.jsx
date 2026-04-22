import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, IconButton, Fade } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'iconsax-react';

export default function Partners({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);
  const swiperRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setChecked(true);
    }
  }, [shouldAnimate]);

  const partners = [
    { id: 1, name: 'الشريك الأول', logo: '/placeholder-logo.png' },
    { id: 2, name: 'الشريك الثاني', logo: '/placeholder-logo.png' },
    { id: 3, name: 'الشريك الثالث', logo: '/placeholder-logo.png' },
    { id: 4, name: 'الشريك الرابع', logo: '/placeholder-logo.png' },
    { id: 5, name: 'الشريك الخامس', logo: '/placeholder-logo.png' },
    { id: 6, name: 'الشريك السادس', logo: '/placeholder-logo.png' }
  ];

  const handleSlideChange = () => {
    if (!swiperRef.current) return;
    setIsAtStart(swiperRef.current.isBeginning);
    setIsAtEnd(swiperRef.current.isEnd);
  };

  const handleNextSlide = () => {
    if (!isAtEnd) {
      swiperRef.current?.slideNext();
    }
  };

  const handlePrevSlide = () => {
    if (!isAtStart) {
      swiperRef.current?.slidePrev();
    }
  };

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          py: { xs: 6, md: 9 },
          backgroundColor: '#fff'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '28px', md: '40px' },
                color: '#1f1f1f',
                mb: 2
              }}
            >
              شركاء نبتة
            </Typography>

            <Typography
              sx={{
                maxWidth: '760px',
                mx: 'auto',
                color: '#6b7280',
                fontSize: { xs: '15px', md: '18px' },
                lineHeight: 1.9
              }}
            >
              نفخر في نبتة بشراكاتنا التي تساهم في دعم رسالتنا وتوسيع أثرنا في تعليم الأطفال.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                handleSlideChange();
              }}
              onSlideChange={handleSlideChange}
              slidesPerView={1}
              spaceBetween={20}
              freeMode={true}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                900: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 4, spaceBetween: 24 }
              }}
              modules={[FreeMode]}
              style={{ padding: '10px 0' }}
            >
              {partners.map((partner, index) => (
                <SwiperSlide key={partner.id}>
                  <Fade
                    in={checked}
                    timeout={800}
                    style={{ transitionDelay: checked ? `${index * 100}ms` : '0ms' }}
                  >
                    <Box
                      sx={{
                        height: 210,
                        border: '1.5px solid #e8e8e8',
                        borderRadius: '20px',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={partner.logo}
                        alt={partner.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Fade>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Bottom Center Arrows */}
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
              }}
            >
              <IconButton
                onClick={handlePrevSlide}
                disabled={isAtStart}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: isAtStart ? '#e0e0e0' : '#d0d5dd',
                  backgroundColor: isAtStart ? '#f5f5f5' : '#fff',
                  opacity: isAtStart ? 0.5 : 1,
                  boxShadow: isAtStart ? 'none' : '0 4px 14px rgba(0,0,0,0.08)'
                }}
              >
                <ArrowRight size={20} color={isAtStart ? '#bdbdbd' : '#0088CC'} />
              </IconButton>

              <IconButton
                onClick={handleNextSlide}
                disabled={isAtEnd}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: isAtEnd ? '#e0e0e0' : '#d0d5dd',
                  backgroundColor: isAtEnd ? '#f5f5f5' : '#fff',
                  opacity: isAtEnd ? 0.5 : 1,
                  boxShadow: isAtEnd ? 'none' : '0 4px 14px rgba(0,0,0,0.08)'
                }}
              >
                <ArrowLeft size={20} color={isAtEnd ? '#bdbdbd' : '#0088CC'} />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}