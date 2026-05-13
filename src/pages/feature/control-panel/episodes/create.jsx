import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import EpisodeForm from 'sections/episodes/EpisodeForm';
import { createEpisode } from 'api/episodes';

// ==============================|| CREATE EPISODE ||============================== //

export default function CreateEpisode() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await createEpisode(values);
      openSnackbar({
        open: true,
        message: 'تم إنشاء الحلقة بنجاح',
        variant: 'alert',
        alert: { color: 'success' }
      });
      navigate('dashboard/episodes');
    } catch (error) {
      openSnackbar({
        open: true,
        message: error?.message || 'حدث خطأ في إنشاء الحلقة',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('dashboard/episodes');
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h4">إضافة حلقة جديدة</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <EpisodeForm onSubmit={handleSubmit} isLoading={isLoading} onCancel={handleCancel} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
