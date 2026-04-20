// material-ui
import { useTheme } from '@mui/material/styles';
import logoIcon from 'assets/images/logo.png';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain({ width = 100 }) {
  const theme = useTheme();

  return (
    <>
      <img src={logoIcon} alt="icon logo" width={width} style={{ height: 'auto' }} />
    </>
  );
}
