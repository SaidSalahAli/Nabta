import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Fade } from '@mui/material';
import img from 'assets/images/test.jpeg';

export default function GoalsPrinciples({ shouldAnimate = false }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (shouldAnimate) setChecked(true);
  }, [shouldAnimate]);

  return (
    <Fade in={checked} timeout={800}>
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              sx={{
                fontSize: { xs: '22px', md: '28px' },
                fontWeight: 800,
                lineHeight: 1.5,
                color: '#2F2B3D'
              }}
            >
              ملتزمون بأهداف طموحة ومبادئ أساسية
            </Typography>
          </Box>

          {/* Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 3, md: 4 }
            }}
          >
            {/* 1 - Goals */}
            <CardBox sx={{ order: { xs: 1, md: 1 } }}>
              <Typography sx={titleStyle}>الأهداف والطموحات:</Typography>

              <Typography sx={textStyle}>• ترسيخ مفهوم أن التربية تعلم والتعليم يربي.</Typography>

              <Typography sx={textStyle}>• الجمع بين متعة التعلم وسهولة الاستخدام.</Typography>
            </CardBox>

            {/* 2 - Image */}
            <ImageBox src={img} sx={{ order: { xs: 2, md: 2 } }} />

            {/* 3 - Principles */}
            <CardBox sx={{ order: { xs: 3, md: 4 } }}>
              <Typography sx={titleStyle}>المبادئ الأساسية:</Typography>

              <Typography sx={textStyle}>الغرس: نغرس بذور المعرفة السليمة داخل أطفالنا.</Typography>

              <Typography sx={textStyle}>المتابعة: نسقي بذور المعرفة بالعناية والمتابعة.</Typography>

              <Typography sx={textStyle}>الحصاد: نثمر بيئة لبناء وعي شامل وعقل ناضج.</Typography>
            </CardBox>

            {/* 4 - Image */}
            <ImageBox src={img} sx={{ order: { xs: 4, md: 3 } }} />
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}

/* ================= UI Components ================= */

function CardBox({ children, sx = {} }) {
  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.75)',
        border: '2px solid #00AEEF',
        borderRadius: '12px',
        p: { xs: 3, md: 4 },
        minHeight: { xs: 200, md: 220 },
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'right',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

function ImageBox({ src, sx = {} }) {
  return (
    <Box
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        height: { xs: 200, sm: 260, md: 220 },
        backgroundColor: '#eee',
        ...sx
      }}
    >
      <Box
        component="img"
        src={src}
        alt=""
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </Box>
  );
}

/* ================= Styles ================= */

const titleStyle = {
  fontWeight: 800,
  fontSize: { xs: '16px', md: '18px' },
  mb: 2,
  color: '#2F2B3D',
  lineHeight: 1.7
};

const textStyle = {
  fontSize: { xs: '14px', md: '15px' },
  lineHeight: 2,
  color: '#555'
};
