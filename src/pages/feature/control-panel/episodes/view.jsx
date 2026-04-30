import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// project-imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { useGetEpisode } from 'api/episodes';

// assets
import { Edit, Trash, DocumentText } from 'iconsax-react';

// ==============================|| EPISODE DETAILS VIEW ||============================== //

export default function ViewEpisode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { episode, episodeLoading } = useGetEpisode(id);
  const [openTranscript, setOpenTranscript] = useState(false);

  const handleEditClick = () => {
    navigate(`/episodes/${id}/edit`);
  };

  const handleTranscriptOpen = () => {
    setOpenTranscript(true);
  };

  const handleTranscriptClose = () => {
    setOpenTranscript(false);
  };

  if (episodeLoading) {
    return <Loader />;
  }

  if (!episode) {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <MainCard>
            <Typography variant="h6" color="error">
              الحلقة غير موجودة
            </Typography>
          </MainCard>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">{episode.title_ar}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<Edit />} onClick={handleEditClick}>
              تحرير
            </Button>
            <Button variant="outlined" color="error" startIcon={<Trash />}>
              حذف
            </Button>
          </Stack>
        </Stack>
      </Grid>

      {/* Main Content */}
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard>
          {/* Video Preview */}
          {episode.cover_image && (
            <Box sx={{ mb: 3 }}>
              <CardMedia component="img" height="400" image={episode.cover_image} alt={episode.title_ar} sx={{ borderRadius: 1 }} />
            </Box>
          )}

          {/* Episode Info */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            معلومات الحلقة
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  رقم الحلقة
                </Typography>
                <Typography variant="body1">{episode.episode_number}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  المدة
                </Typography>
                <Typography variant="body1">{Math.floor(episode.duration_seconds / 60)} دقيقة</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  نوع الفيديو
                </Typography>
                <Typography variant="body1">{episode.video_type}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  الحالة
                </Typography>
                <Stack direction="row" spacing={1}>
                  {episode.is_published && <Chip label="منشورة" color="success" size="small" />}
                  {episode.is_featured && <Chip label="مميزة" color="primary" size="small" />}
                  {episode.has_worksheets && <Chip label="أوراق عمل" color="info" size="small" />}
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            الوصف
          </Typography>
          <Typography variant="body2" paragraph>
            {episode.short_description_ar}
          </Typography>
          <Typography variant="body1" paragraph>
            {episode.description_ar}
          </Typography>

          {/* Transcript Button */}
          {episode.transcript_ar && (
            <>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" startIcon={<DocumentText />} onClick={handleTranscriptOpen} fullWidth>
                عرض نص الحلقة
              </Button>
            </>
          )}
        </MainCard>
      </Grid>

      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
                الرابط النصي
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {episode.slug}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
                رابط الفيديو
              </Typography>
              <Typography
                variant="body2"
                component="a"
                href={episode.video_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none', wordBreak: 'break-all' }}
              >
                اضغط هنا
              </Typography>
            </Box>

            <Divider />

            {episode.thumbnail_image && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  الصورة المصغرة
                </Typography>
                <CardMedia component="img" height="150" image={episode.thumbnail_image} alt="thumbnail" sx={{ borderRadius: 1 }} />
              </Box>
            )}
          </Stack>
        </MainCard>
      </Grid>

      {/* Transcript Modal */}
      <Dialog open={openTranscript} onClose={handleTranscriptClose} maxWidth="sm" fullWidth>
        <DialogTitle>نص الحلقة</DialogTitle>
        <DialogContent>
          <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mt: 2 }}>{episode.transcript_ar}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTranscriptClose}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
