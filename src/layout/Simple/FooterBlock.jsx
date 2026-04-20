import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import Logo from 'components/logo';
import { Youtube, Facebook, Instagram, Send2, ArrowUp } from 'iconsax-react';

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 15,
  fontWeight: 400,
  textDecoration: 'none',
  opacity: 0.75,
  transition: 'opacity 0.2s, color 0.2s',
  '&:hover': {
    opacity: 1,
    color: theme.palette.primary.main
  }
}));

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function FooterBlock({ isFull }) {
  const socialLinks = [
    { icon: <Send2 variant="Bold" size={20} />, label: 'Telegram', href: '#' },
    { icon: <Youtube variant="Bold" size={20} />, label: 'YouTube', href: '#' },
    { icon: <Instagram variant="Bold" size={20} />, label: 'Instagram', href: '#' },
    { icon: <Facebook variant="Bold" size={20} />, label: 'Facebook', href: '#' }
  ];

  const col1 = [
    { label: 'الرئيسية', href: '#' },
    { label: 'قصتنا', href: '#' },
    { label: 'الأسئلة الشائعة', href: '#' },
    { label: 'تواصل معنا', href: '#' }
  ];

  const col2 = [
    { label: 'المتجر', href: '#' },
    { label: 'كيف تدعمنا؟', href: '#' },
    { label: 'ورش عمل ومناسبات', href: '#' }
  ];

  return (
    <>
      {/* ===== MAIN FOOTER ===== */}
      <Box
        sx={{
          pt: isFull ? 5 : 8,
          pb: 6,
          bgcolor: 'secondary',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container>
          <Grid container spacing={4} direction="row-reverse">
            {/* RIGHT: Nav columns */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={4} direction="row-reverse">
                {/* Column 1 */}
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Stack gap={2.5}>
                    {col1.map(({ label, href }) => (
                      <FooterLink key={label} href={href} underline="none">
                        {label}
                      </FooterLink>
                    ))}
                  </Stack>
                </Grid>

                {/* Column 2 */}
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Stack gap={2.5}>
                    {col2.map(({ label, href }) => (
                      <FooterLink key={label} href={href} underline="none">
                        {label}
                      </FooterLink>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* LEFT: Logo + Social Icons */}
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
              >
                <Stack gap={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
                  <Logo to="/" />

                  {/* Social Icons */}
                  <Stack direction="row" gap={1.5}>
                    {socialLinks.map(({ icon, label, href }) => (
                      <Tooltip key={label} title={label}>
                        <IconButton
                          component={Link}
                          href={href}
                          target="_blank"
                          size="small"
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '50%',
                            width: 38,
                            height: 38,
                            color: 'text.secondary',
                            transition: 'all 0.2s',
                            '&:hover': {
                              color: 'primary.main',
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          {icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Stack>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== BOTTOM BAR ===== */}
      <Box
        sx={{
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'secondary.200'
        }}
      >
        <Container>
          <Grid container spacing={2} alignItems="center" direction="row-reverse" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            {/* Right: Copyright */}
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ flexGrow: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7, fontSize: 13 }}>
                جميع الحقوق محفوظة © منصة Nabta {new Date().getFullYear()}
              </Typography>
            </Grid>

            {/* Center: Legal Links */}
            <Grid size={{ xs: 12, sm: 'auto' }}>
              <Stack direction="row" gap={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                {[
                  { label: 'الشروط والأحكام', href: '#' },
                  { label: 'سياسة الخصوصية', href: '#' }
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    underline="always"
                    sx={{
                      fontSize: 13,
                      color: 'text.secondary',
                      opacity: 0.7,
                      '&:hover': { opacity: 1, color: 'primary.main' }
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Left: Scroll to top */}
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
              <Tooltip title="للأعلى">
                <IconButton
                  onClick={scrollToTop}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    width: 36,
                    height: 36,
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: 'action.hover' }
                  }}
                >
                  <ArrowUp size={18} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

FooterBlock.propTypes = { isFull: PropTypes.bool };
