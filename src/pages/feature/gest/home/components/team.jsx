import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, IconButton, Fade } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'iconsax-react';

export default function Team({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);
  const swiperRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setChecked(true);
    }
  }, [shouldAnimate]);

  const members = [
    {
      id: 1,
      name: 'اسم العضو',
      role: 'الدور الوظيفي',
      image: '/placeholder-person.png'
    },
    {
      id: 2,
      name: 'اسم العضو',
      role: 'الدور الوظيفي',
      image: '/placeholder-person.png'
    },
    {
      id: 3,
      name: 'اسم العضو',
      role: 'الدور الوظيفي',
      image: '/placeholder-person.png'
    },
    {
      id: 4,
      name: 'اسم العضو',
      role: 'الدور الوظيفي',
      image: '/placeholder-person.png'
    },
    {
      id: 5,
      name: 'اسم العضو',
      role: 'الدور الوظيفي',
      image: '/placeholder-person.png'
    }
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
          backgroundColor: '#fcfcfc'
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
              فريق نبتة
            </Typography>

            <Typography
              sx={{
                maxWidth: '900px',
                mx: 'auto',
                color: '#6b7280',
                fontSize: { xs: '15px', md: '18px' },
                lineHeight: 1.9
              }}
            >
              فريق نبتة يعمل بحب ورؤية بأنهم أساس نجاح الفكرة، ويجمع بين الخبرة والاهتمام الحقيقي بالطفل، لذلك نسعى دائمًا لإخراج محتوى مفيد
              ومحبب للأطفال.
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
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 }
              }}
              modules={[FreeMode]}
              style={{ padding: '10px 0' }}
            >
              {members.map((member, index) => (
                <SwiperSlide key={member.id}>
                  <Fade in={checked} timeout={800} style={{ transitionDelay: checked ? `${index * 100}ms` : '0ms' }}>
                    <Box
                      sx={{
                        borderRadius: '24px',
                        backgroundColor: '#fff',
                        border: '1px solid #ececec',
                        p: 2.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: 240,
                          borderRadius: '20px',
                          overflow: 'hidden',
                          backgroundColor: '#f7f7f7',
                          mb: 2
                        }}
                      >
                        <Box
                          component="img"
                          src={member.image}
                          alt={member.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '22px',
                          color: '#1f1f1f',
                          textAlign: 'center',
                          mb: 1
                        }}
                      >
                        {member.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '16px',
                          color: '#6b7280',
                          textAlign: 'center'
                        }}
                      >
                        {member.role}
                      </Typography>
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
