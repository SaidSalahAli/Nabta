import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Container, Fade, IconButton, Dialog } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, FreeMode } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import img from 'assets/images/test.png';

export default function Episodes({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const swiperRef = useRef(null);

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

  // Card image height + half card total height ≈ centers arrow on image area
  const CARD_IMAGE_HEIGHT = 250;

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
          <Box
            sx={{
              position: 'relative',
              px: '48px', // make room for arrows on both sides
              '& .swiper-pagination-bullet': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                width: 8,
                height: 8,
                opacity: 0.5,
                borderRadius: '50%'
              },
              '& .swiper-pagination-bullet-active': {
                backgroundColor: '#0088CC',
                opacity: 1
              },
              '& .swiper-pagination': {
                bottom: '-35px !important',
                position: 'relative'
              }
            }}
          >
            {/* LEFT arrow — goes to next (in RTL this is "forward") */}
            <IconButton
              onClick={handleNextSlide}
              disabled={isAtEnd}
              sx={{
                position: 'absolute',
                right: 0,
                top: `${CARD_IMAGE_HEIGHT / 2}px`,
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: 40,
                height: 40,
                bgcolor: isAtEnd ? 'action.disabledBackground' : 'background.paper',
                boxShadow: isAtEnd ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '50%',
                border: '1px solid',
                borderColor: isAtEnd ? 'action.disabled' : 'divider',
                opacity: isAtEnd ? 0.5 : 1,
                cursor: isAtEnd ? 'not-allowed' : 'pointer',
                '&:hover': {
                  borderColor: isAtEnd ? 'action.disabled' : 'primary.main',
                  backgroundColor: isAtEnd ? 'action.disabledBackground' : 'background.paper',
                  '& svg': { color: isAtEnd ? '#999' : '#fff' }
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={20} color={isAtEnd ? '#ccc' : '#0088CC'} />
            </IconButton>

            {/* RIGHT arrow — goes to prev */}
            <IconButton
              onClick={handlePrevSlide}
              disabled={isAtStart}
              sx={{
                position: 'absolute',
                left: 0,
                top: `${CARD_IMAGE_HEIGHT / 2}px`,
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: isAtStart ? 'action.disabledBackground' : 'background.paper',
                boxShadow: isAtStart ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
                border: '1px solid',
                borderColor: isAtStart ? 'action.disabled' : 'divider',
                opacity: isAtStart ? 0.5 : 1,
                cursor: isAtStart ? 'not-allowed' : 'pointer',
                '&:hover': {
                  borderColor: isAtStart ? 'action.disabled' : 'primary.main',
                  backgroundColor: isAtStart ? 'action.disabledBackground' : 'background.paper',
                  '& svg': { color: isAtStart ? '#999' : '#fff' }
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowRight size={20} color={isAtStart ? '#ccc' : '#0088CC'} />
            </IconButton>

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                handleSlideChange();
              }}
              onSlideChange={handleSlideChange}
              slidesPerView={1}
              spaceBetween={20}
              freeMode={true}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
                1280: { slidesPerView: 3, spaceBetween: 20 }
              }}
              modules={[Pagination, FreeMode]}
              style={{ padding: '10px 0 50px 0' }}
            >
              {episodes.map((episode, index) => (
                <SwiperSlide key={episode.id}>
                  <Fade in={checked} timeout={800} style={{ transitionDelay: checked ? `${index * 100}ms` : '0ms' }}>
                    <Card
                      sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={episode.image}
                          alt={episode.title}
                          sx={{
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              lineHeight: 1.4,
                              width: '100%',

                              minHeight: '40px',
                              fontSize: '18px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {episode.title}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'end',
                              fontSize: '18px',
                              fontWeight: 600,
                              width: '100%',
                              color: '#0088CC',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': { color: '#006699' }
                            }}
                          >
                            {episode.watch}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* View All Link */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
              cursor: 'pointer',
              '&:hover': { '& .view-all-text': { color: '#006699' } }
            }}
          >
            <Typography
              className="view-all-text"
              sx={{ fontSize: '14px', fontWeight: 600, color: '#0088CC', transition: 'color 0.3s ease' }}
            >
              المزيد ...
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}
