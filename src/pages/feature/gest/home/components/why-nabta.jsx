import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Fade, Grid } from '@mui/material';
import workImg from 'assets/Home/Work.svg';
import KnowledgeImg from 'assets/Home/Knowledge.svg';
import ExperienceImg from 'assets/Home/Experience.svg';

export default function WhyNabta({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setChecked(true);
    }
  }, [shouldAnimate]);

  const reasons = [
    {
      id: 1,
      title: 'العلم',
      description: 'الاستناد إلى أحدث الأبحاث والدراسات في التربية والتعليم.',
      img: KnowledgeImg
    },
    {
      id: 2,
      title: 'العمل',
      description: 'تجارب عملية واقعية، ونتائج مجرّبة ومؤثرة.',
      img: workImg
    },
    {
      id: 3,
      title: 'الخبرة',
      description: 'فهم احتياجات الأطفال وأولياء الأمور والمعلمين.',
      img: ExperienceImg
    }
  ];

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          width: '100%',
          backgroundColor: '#ffff'
        }}
      >
        <Container maxWidth="lg">
          {/* Title Section */}
          <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                mb: 3,
                fontSize: { xs: '30px', sm: '36px', md: '42px' }
              }}
            >
              لماذا تختار نبتة؟
            </Typography>
          </Box>

          {/* Reasons Grid */}
          <Grid
            container
            spacing={{ xs: 3, md: 0 }}
            sx={{
              alignItems: 'stretch'
            }}
          >
            {reasons.map((reason, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={reason.id}
                sx={{
                  position: 'relative',
                  display: 'flex',

                  ...(index !== reasons.length - 1 && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '18%',
                      right: 0,
                      transform: 'translateX(-50%)',
                      height: '64%',
                      width: '1px',
                      backgroundColor: '#d6d6d6',
                      display: { xs: 'none', md: 'block' }
                    }
                  })
                }}
              >
                <Fade in={checked} timeout={800} style={{ transitionDelay: checked ? `${index * 150}ms` : '0ms' }}>
                  <Card
                    sx={{
                      width: '100%',
                      borderRadius: 0,
                      overflow: 'visible',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      minHeight: { xs: 'auto', md: 260 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      position: 'relative'
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2,
                        px: { xs: 2, sm: 4, md: 5 },
                        py: { xs: 2, md: 3 }
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 80, sm: 100, md: 120 },
                          height: { xs: 80, sm: 100, md: 120 },
                          mb: 2
                        }}
                      >
                        <img src={reason.img} alt={reason.title} style={{ width: '100%', height: '100%' }} />
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#4a4a4a',
                          fontSize: { xs: '28px', md: '36px' },
                          mb: 1
                        }}
                      >
                        {reason.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#5f5f5f',
                          fontSize: { xs: '17px', md: '22px' },
                          lineHeight: 1.9,
                          fontWeight: 400,
                          maxWidth: '290px'
                        }}
                      >
                        {reason.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
}
