import React, { useEffect, useState } from 'react';
import { Box, Container, Fade, Typography } from '@mui/material';

export default function AboutNabta({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) setChecked(true);
  }, [shouldAnimate]);

  return (
    <Fade in={checked} timeout={800}>
      <Box
        sx={{
          py: { xs: 8, md: 6 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          {/* Heading */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.4
              }}
            >
              نبته
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                lineHeight: 1.9,
                maxWidth: '1000px',
                mx: 'auto'
              }}
            >
              منصة صناعة محتوى تربوي تعليمي للأطفال، ودعم الأمهات والآباء
              <br />
              تربية تتعلّم... وتعليم يربّي
            </Typography>
          </Box>

          {/* Main layout */}
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 'auto', md: 556 }
            }}
          >
            {/* Mobile layout */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                gap: 3
              }}
            >
              <InfoBox
                title="من نحن:"
                content="نبته: منصة رائدة في صناعة محتوى الأطفال التربوي والتعليمي، ودعم الأمهات والآباء من خلال: نصائح تربوية، تطبيقات تعليمية، فيديوهات توعوية، أوراق مذاكرة وتلوين، ورش عمل، أنشطة وألعاب تفاعلية."
              />

              <InfoBox
                title="المهمة الأساسية:"
                content="مهمتنا الأساسية نابعة من شعارنا.. اغرس بذرة.. تنبت نبته.. تحصد ثمرة. نحن نغرس بذور المعرفة الصافية داخل أطفالنا، ونسقيها بالحب والمتابعة لتصبح نبتة جميلة وراسخة، وتنتج يانعة بما نأمله."
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CenterCircle />
              </Box>

              <InfoBox
                title="لماذا اسم نبته؟"
                content="لأننا نؤمن بأن الأطفال مثل النباتات، كلما اعتنيت بهم وسقيتهم المعرفة السليمة، أثمروا وأزهروا نبتة طيبة ونافعة."
              />

              <InfoBox
                title="الرؤية المستقبلية:"
                content="أن نُصبح مركزًا إقليميًا موثوقًا به ينافس في مجال صناعة المحتوى التربوي التعليمي للأطفال، ودعم الأمهات والآباء بمنهجية علمية وأساليب متطورة."
              />
            </Box>

            {/* Desktop layout */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', minHeight: 556 }}>
              {/* top left */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '38%',
                  zIndex: 2
                }}
              >
                <InfoBox
                  title="المهمة الأساسية:"
                  content="مهمتنا الأساسية نابعة من شعارنا.. اغرس بذرة.. تنبت نبته.. تحصد ثمرة. نحن نغرس بذور المعرفة الصافية داخل أطفالنا، ونسقيها بالحب والمتابعة لتصبح نبتة جميلة وراسخة، وتنتج يانعة بما نأمله."
                />
              </Box>
              {/* top right */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '38%',
                  zIndex: 2
                }}
              >
                <InfoBox
                  title="من نحن:"
                  content="نبته: منصة رائدة في صناعة محتوى الأطفال التربوي والتعليمي، ودعم الأمهات والآباء من خلال: نصائح تربوية، تطبيقات تعليمية، فيديوهات توعوية، أوراق مذاكرة وتلوين، ورش عمل، أنشطة وألعاب تفاعلية."
                />
              </Box>
              {/* bottom left */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '38%',
                  zIndex: 2
                }}
              >
                <InfoBox
                  title="الرؤية المستقبلية:"
                  content="أن نُصبح مركزًا إقليميًا موثوقًا به ينافس في مجال صناعة المحتوى التربوي التعليمي للأطفال، ودعم الأمهات والآباء بمنهجية علمية وأساليب متطورة."
                />
              </Box>
              {/* bottom right */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '38%',
                  zIndex: 2
                }}
              >
                <InfoBox
                  title="لماذا اسم نبته؟"
                  content="لأننا نؤمن بأن الأطفال مثل النباتات، كلما اعتنيت بهم وسقيتهم المعرفة السليمة، أثمروا وأزهروا نبتة طيبة ونافعة."
                />
              </Box>
              {/* center */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3
                }}
              >
                <CenterCircle />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}

function InfoBox({ title, content }) {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255,255,255,0.72)',
        border: '2px solid #0088CC',
        borderRadius: '28px',
        p: { xs: 3, md: 4 },
        minHeight: { xs: 'auto', md: 250 },
        backdropFilter: 'blur(2px)'
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '15px', md: '20px' },
          fontWeight: 800,
          color: '#3A3246',
          mb: 2,
          lineHeight: 1.6
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '14px', md: '16px' },
          color: '#5B5368',
          lineHeight: 2
        }}
      >
        {content}
      </Typography>
    </Box>
  );
}

function CenterCircle() {
  return (
    <Box sx={{ position: 'relative', width: { xs: 180, md: 150 }, height: { xs: 180, md: 150 } }}>
      {/* circle */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid #0088CC',
          background: 'radial-gradient(circle at 30% 30%, #fffefb 0%, #fff8ec 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '32px', md: '30px' },
            fontWeight: 800,
            color: '#3A3246',
            lineHeight: 1
          }}
        >
          قصتنا
        </Typography>
      </Box>
    </Box>
  );
}
