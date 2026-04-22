import React, { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, FreeMode } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import EpisodeCard from './EpisodeCard';

export default function EpisodeSwiper({ episodes, isAnimating }) {
  const swiperRef = useRef(null);
  const [isAtStart, setIsAtStart] = React.useState(true);
  const [isAtEnd, setIsAtEnd] = React.useState(false);

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
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 20 }
        }}
        modules={[Pagination, FreeMode]}
        style={{ padding: '10px 0 20px 0' }}
      >
        {episodes.map((episode, index) => (
          <SwiperSlide key={episode.id}>
            <EpisodeCard episode={episode} isAnimating={isAnimating} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
