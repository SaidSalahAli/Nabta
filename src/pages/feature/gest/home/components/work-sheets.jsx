import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Fade, Typography } from '@mui/material';
import img from 'assets/Home/worksheets.svg';
export default function Worksheets({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) setChecked(true);
  }, [shouldAnimate]);

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              alignItems: 'center',
              gap: { xs: 5, md: 6 }
            }}
          >
            {/* LEFT CONTENT */}
            <Box sx={{ textAlign: { xs: 'center', md: 'start' } }}>
              <Typography
                sx={{
                  fontSize: { xs: '34px', md: '52px' },
                  fontWeight: 800,
                  color: '#2E2A39',
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                أوراق عمل
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '18px', md: '24px' },
                  color: '#5F5A6B',
                  lineHeight: 2,
                  maxWidth: { xs: '100%', md: '700px' },
                  mx: { xs: 'auto', md: 0 },
                  mb: 4
                }}
              >
                اطبع أوراق مذاكرة وتلوين، واجعل طفلك يتفاعل بنفسه مع الورقة والقلم والألوان، لتنمّي قدراته الحركية ومهاراته الإبداعية.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 3
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    px: 5,
                    py: 1.6,
                    borderRadius: '18px',
                    fontSize: { xs: '18px', md: '22px' },
                    fontWeight: 700,
                    backgroundColor: '#FFD666',
                    color: '#2E2A39',
                    boxShadow: '0 10px 25px rgba(255, 214, 102, 0.35)',
                    '&:hover': {
                      backgroundColor: '#ffcf4d'
                    }
                  }}
                >
                  حمّل الآن مجانًا
                </Button>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: '15px', md: '18px' },
                  color: '#7A7388',
                  lineHeight: 2,
                  maxWidth: { xs: '100%', md: '650px' },
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                عند الضغط على الزر، ينتقل المستخدم إلى صفحة تحتوي على ملفات أوراق المذاكرة والتلوين القابلة للطباعة، مع بعض الخيارات
                المناسبة للأطفال.
              </Typography>
            </Box>

            {/* RIGHT ILLUSTRATION */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative'
                }}
              >
                <img src={img} alt="Worksheets" style={{ width: '100%', height: '100%' }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}
