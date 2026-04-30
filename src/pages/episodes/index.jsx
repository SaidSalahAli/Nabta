import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// project-imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { useGetEpisodes, deleteEpisode } from 'api/episodes';
import { useGetEpisodeCategories } from 'api/episodeCategories';
import { openSnackbar } from 'api/snackbar';

// assets
import { Eye, Edit, Trash, Add } from 'iconsax-react';

// ==============================|| EPISODES LIST ||============================== //

export default function EpisodesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const { episodes = [], episodesLoading, episodesMutate } = useGetEpisodes();
  const { categories = [] } = useGetEpisodeCategories();

  // Filter episodes
  const filteredEpisodes = episodes.filter((episode) => {
    const matchesSearch = episode.title_ar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || episode.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const paginatedEpisodes = filteredEpisodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    navigate('/episodes/create');
  };

  const handleViewClick = (id) => {
    navigate(`/episodes/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/episodes/${id}/edit`);
  };

  const handleDeleteClick = (episode) => {
    setSelectedEpisode(episode);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEpisode(selectedEpisode.id);
      openSnackbar({
        open: true,
        message: 'تم حذف الحلقة بنجاح',
        variant: 'alert',
        alert: { color: 'success' }
      });
      episodesMutate();
      setDeleteDialogOpen(false);
      setSelectedEpisode(null);
    } catch (error) {
      openSnackbar({
        open: true,
        message: error?.message || 'حدث خطأ في حذف الحلقة',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEpisode(null);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name_ar || '-';
  };

  if (episodesLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">الحلقات</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateClick}>
            إضافة حلقة
          </Button>
        </Stack>
      </Grid>

      {/* Filters */}
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                placeholder="بحث عن حلقة..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(0);
                }}
                placeholder="التصنيف"
              >
                <MenuItem value="">جميع التصنيفات</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name_ar}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* Table */}
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">الصورة المصغرة</TableCell>
                  <TableCell>العنوان</TableCell>
                  <TableCell>التصنيف</TableCell>
                  <TableCell align="center">رقم الحلقة</TableCell>
                  <TableCell align="center">منشورة</TableCell>
                  <TableCell align="center">أوراق عمل</TableCell>
                  <TableCell align="center">تاريخ الإنشاء</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEpisodes.length > 0 ? (
                  paginatedEpisodes.map((episode) => (
                    <TableRow key={episode.id} hover>
                      <TableCell align="center">
                        {episode.thumbnail_image && (
                          <Box
                            component="img"
                            src={episode.thumbnail_image}
                            alt={episode.title_ar}
                            sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{episode.title_ar}</TableCell>
                      <TableCell>{getCategoryName(episode.category_id)}</TableCell>
                      <TableCell align="center">{episode.episode_number}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={episode.is_published ? 'نعم' : 'لا'}
                          color={episode.is_published ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={episode.has_worksheets ? 'نعم' : 'لا'}
                          color={episode.has_worksheets ? 'info' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{new Date(episode.created_at).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Button size="small" variant="outlined" onClick={() => handleViewClick(episode.id)} startIcon={<Eye size={16} />}>
                            عرض
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEditClick(episode.id)}
                            startIcon={<Edit size={16} />}
                          >
                            تحرير
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteClick(episode)}
                            startIcon={<Trash size={16} />}
                          >
                            حذف
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        لا توجد حلقات متطابقة
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEpisodes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </MainCard>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>هل تريد بالتأكيد حذف الحلقة "{selectedEpisode?.title_ar}"؟ لا يمكن التراجع عن هذا الإجراء.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>إلغاء</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
