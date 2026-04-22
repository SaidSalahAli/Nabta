import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Fade, Typography } from '@mui/material';

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
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #fffdf8 0%, #fffaf1 45%, #fffdf8 100%)'
        }}
      >
        {/* simple background shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: 50,
            left: { xs: -30, md: 40 },
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 214, 102, 0.18)',
            filter: 'blur(6px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            right: { xs: -20, md: 60 },
            width: 150,
            height: 150,
            borderRadius: '30px',
            backgroundColor: 'rgba(163, 220, 255, 0.18)',
            transform: 'rotate(18deg)',
            filter: 'blur(4px)'
          }}
        />

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
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
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
                  position: 'relative',
                  width: { xs: 260, sm: 320, md: 360 },
                  height: { xs: 260, sm: 320, md: 360 }
                }}
              >
                {/* papers الخلفية */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 60,
                    right: 38,
                    width: 90,
                    height: 120,
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    border: '3px solid #3B354A',
                    transform: 'rotate(16deg)',
                    zIndex: 1
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 55,
                    left: 40,
                    width: 90,
                    height: 120,
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    border: '3px solid #3B354A',
                    transform: 'rotate(-14deg)',
                    zIndex: 1
                  }}
                />

                {/* main paper */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 35,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: { xs: 120, md: 140 },
                    height: { xs: 160, md: 180 },
                    borderRadius: '14px',
                    backgroundColor: '#fff',
                    border: '3px solid #3B354A',
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: '#3B354A' }}>ورقة</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: '#3B354A' }}>عمل</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: '#3B354A' }}>تلوين</Typography>
                </Box>

                {/* box */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 35,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: { xs: 220, sm: 250, md: 270 },
                    height: { xs: 110, sm: 120, md: 130 },
                    borderRadius: '16px',
                    background: 'linear-gradient(180deg, #BEEBFF 0%, #9EDDFB 100%)',
                    border: '4px solid #3B354A',
                    zIndex: 2
                  }}
                />

                {/* front flap */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 122,
                    left: 52,
                    width: 70,
                    height: 35,
                    backgroundColor: '#d9f3ff',
                    border: '4px solid #3B354A',
                    borderBottom: 'none',
                    transform: 'skewX(-18deg)',
                    borderTopLeftRadius: '10px'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 122,
                    right: 52,
                    width: 70,
                    height: 35,
                    backgroundColor: '#d9f3ff',
                    border: '4px solid #3B354A',
                    borderBottom: 'none',
                    transform: 'skewX(18deg)',
                    borderTopRightRadius: '10px'
                  }}
                />

                {/* small label */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    px: 2,
                    py: 1,
                    borderRadius: '14px',
                    backgroundColor: '#fff',
                    border: '2px dashed #3B354A'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#3B354A'
                    }}
                  >
                    صورة توضيحية
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}
