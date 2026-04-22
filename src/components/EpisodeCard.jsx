import React, { useState } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Fade } from '@mui/material';

export default function EpisodeCard({ episode, isAnimating, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fade in={isAnimating} timeout={800} style={{ transitionDelay: isAnimating ? `${index * 100}ms` : '0ms' }}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
  );
}
