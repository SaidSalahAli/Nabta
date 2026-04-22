import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Fade, Grid } from '@mui/material';

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
      title: 'المعلم',
      description: 'الاستناد إلى أحدث الأبحاث والدراسات في التربية والتعليم.',
      icon: '👨‍🏫'
    },
    {
      id: 2,
      title: 'العمل',
      description: 'تجارب عملية وواقعية وتطبيقية وفعّالة.',
      icon: '💼'
    },
    {
      id: 3,
      title: 'الخبرة',
      description: 'فهم احتياجات الأطفال وأولياء الأمور والمعلمين.',
      icon: '🎓'
    }
  ];

  return (
    <Fade in={checked} timeout={800}>
      <Box sx={{ py: 8, width: '100%', backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          {/* Title Section */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                mb: 3,
                fontSize: { xs: '32px', sm: '40px', md: '30px' }
              }}
            >
              لماذا تختار نبتة؟
            </Typography>
          </Box>

          {/* Reasons Grid */}
          <Grid container spacing={4}>
            {reasons.map((reason, index) => (
              <Grid item xs={12} sm={6} md={4} key={reason.id}>
                <Fade in={checked} timeout={800} style={{ transitionDelay: checked ? `${index * 150}ms` : '0ms' }}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#fff',
                      border: '2px solid transparent',
                      position: 'relative',
                      '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 136, 204, 0.15)',
                        transform: 'translateY(-8px)',
                        borderColor: '#0088CC'
                      }
                    }}
                  >
                    {/* Top Border Line */}
                    <Box
                      sx={{
                        height: '4px',
                        background: 'linear-gradient(90deg, #0088CC 0%, #00AA99 100%)',
                        transition: 'all 0.3s ease'
                      }}
                    />

                    <CardContent
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2.5,
                        p: 4
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          fontSize: '56px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '80px',
                          height: '80px',
                          backgroundColor: '#E8F4FF',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {reason.icon}
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#0088CC',
                          fontSize: '24px'
                        }}
                      >
                        {reason.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '16px',
                          lineHeight: 1.8,
                          fontWeight: 500
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

          {/* Bottom decoration line */}
          <Box
            sx={{
              mt: 8,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #0088CC 50%, transparent 100%)',
              maxWidth: '400px',
              mx: 'auto'
            }}
          />
        </Container>
      </Box>
    </Fade>
  );
}
