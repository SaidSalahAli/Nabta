import { Box, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import character_1 from 'assets/Home/Moslem Animation.svg';
import character_2 from 'assets/Home/Moslema Animation.svg';

export default function Characters({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) setChecked(true);
  }, [shouldAnimate]);

  const characters = [
    {
      id: 1,
      name: 'مسلم',
      image: character_1,
      description:
        'الطفل مُسلم هو طفل ذكي ومُحب للاستكشاف والتعلم لكل جديد ومفيد، ويحافظ على الصلاة في أوقاتها، ويعتني بصحته ويمارس الرياضة وله مواقف ملهمة أثناء تعلمه الحروف العربية.',
      reverse: false
    },
    {
      id: 2,
      name: 'مسلمة',
      image: character_2,
      description:
        'الطفلة مُسلمة هي طفلة جميلة ومهذبة وتحب الجلوس بالبيت والاعتناء به، تتعلم من أمها أشياء كثيرة مثل ترتيب المنزل وتحضير الطعام ومع ذلك هي مجتهدة في دراستها ومذاكرتها، ولها مواقف رائعة مع أخوها مُسلم أثناء تعلمها معه الحروف العربية.',
      reverse: true
    }
  ];

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          py: 6,
          width: '100%',
          backgroundColor: '#ffd6003b'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1
            }}
          >
            شخصيات نبتة
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 5,
              alignItems: 'stretch'
            }}
          >
            {characters.map((character, index) => (
              <Fade
                key={character.id}
                in={checked}
                timeout={800}
                style={{ transitionDelay: checked ? `${index * 200}ms` : '0ms' }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: character.reverse
                      ? { xs: 'column', md: 'row-reverse' }
                      : { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                    gap: 2,
                    minWidth: 0
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  >
                    <Box
                      component="img"
                      src={character.image}
                      alt={character.name}
                      sx={{
                        maxHeight: '250px',
                        width: '100%',
                        maxWidth: { xs: '220px', md: '250px' },
                        objectFit: 'contain'
                      }}
                    />
                  </Box>

                  {/* Text Box with Name Badge */}
                  <Box
                    sx={{
                      flex: 1,
                      position: 'relative',
                      pt: 2,
                      display: 'flex'
                    }}
                  >
                    {/* Name badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        ...(character.reverse ? { right: 16 } : { left: 16 }),
                        zIndex: 2,
                        backgroundColor: 'background.paper',
                        border: '2px solid',
                        borderColor: '#0088CC',
                        borderRadius: '20px',
                        px: 2,
                        py: 0.5
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '20px',
                          color: '#0088CC'
                        }}
                      >
                        {character.name}
                      </Typography>
                    </Box>

                    {/* Description box */}
                    <Box
                      sx={{
                        border: '2.5px solid',
                        borderColor: '#0088CC',
                        borderRadius: '12px',
                        p: 3,
                        pt: 4,
                        mt: 1.5,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(0, 136, 204, 0.15)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.9,
                          fontSize: '18px',
                          textAlign: 'right'
                        }}
                      >
                        {character.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}