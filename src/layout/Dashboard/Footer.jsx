import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

export default function Footer() {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: '24px 16px 0px', mt: 'auto' }}>

      <Stack direction="row" sx={{ gap: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
        <Link component={RouterLink} to="#" target="_blank" variant="caption" color="text.primary">
          Home
        </Link>
 
      </Stack>
    </Stack>
  );
}
