import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { openSnackbar } from 'api/snackbar';
import EpisodeForm from 'sections/episodes/EpisodeForm';
import { useGetEpisode, updateEpisode } from 'api/episodes';

// ==============================|| EDIT EPISODE ||============================== //

export default function EditEpisode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { episode, episodeLoading } = useGetEpisode(id);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await updateEpisode(id, values);
      openSnackbar({
        open: true,
        message: 'تم تحديث الحلقة بنجاح',
        variant: 'alert',
        alert: { color: 'success' }
      });
      setTimeout(() => {
        navigate('/dashboard/episodes');
      }, 1500);
    } catch (error) {
      openSnackbar({
        open: true,
        message: error?.message || 'حدث خطأ في تحديث الحلقة',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/episodes');
  };

  if (episodeLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h4">تحرير الحلقة</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <EpisodeForm episode={episode} onSubmit={handleSubmit} isLoading={isLoading} onCancel={handleCancel} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
