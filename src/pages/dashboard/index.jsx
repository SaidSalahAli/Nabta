// material-ui
import Grid from '@mui/material/Grid2';

// project-imports
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';

// ==============================|| DASHBOARD PAGE ||============================== //

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Grid container sx={{ mt: 3 }} spacing={3}>
      <Grid size={{ xs: 12 }}>
        <MainCard title="Welcome to Dashboard">
          <p>Hello {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}!</p>
          <p>You are successfully logged in. This is your dashboard.</p>
        </MainCard>
      </Grid>
    </Grid>
  );
}
