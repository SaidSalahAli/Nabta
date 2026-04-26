// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// lottie
import logoAnimation from 'assets/images/logoAnimation.json';
import Lottie from 'lottie-react';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.8)',
  '& > * + *': { marginTop: theme.spacing(2) }
}));

// ==============================|| Loader ||============================== //

export default function Loader() {
  return (
    <LoaderWrapper>
      <Lottie animationData={logoAnimation} loop={true} style={{ width: 100, height: 100 }} />
    </LoaderWrapper>
  );
}
