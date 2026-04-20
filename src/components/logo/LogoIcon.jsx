// material-ui
import { useTheme } from '@mui/material/styles';
import logoIcon from 'assets/images/logo.png';

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon({ width = 100 }) {
  const theme = useTheme();

  return (
    <>
      <img src={logoIcon} alt="icon logo" width={width} style={{ height: 'auto' }} />
    </>
  );
}
