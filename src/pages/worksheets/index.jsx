import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
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
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DialogContentText from '@mui/material/DialogContentText';
import MenuItem from '@mui/material/MenuItem';

// project-imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { useGetWorksheets, deleteWorksheet } from 'api/worksheets';
import { useGetEpisodes } from 'api/episodes';
import { useGetEpisodeCategories } from 'api/episodeCategories';
import { openSnackbar } from 'api/snackbar';
import WorksheetForm from 'sections/episodes/WorksheetForm';
import { createWorksheet, updateWorksheet } from 'api/worksheets';

// assets
import { Edit, Trash, Add } from 'iconsax-react';

// ==============================|| WORKSHEETS ||============================== //

export default function Worksheets() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { worksheets = [], worksheetsLoading, worksheetsMutate } = useGetWorksheets();
  const { episodes = [] } = useGetEpisodes();
  const { categories = [] } = useGetEpisodeCategories();

  // Filter worksheets
  const filteredWorksheets = worksheets.filter((worksheet) => {
    const matchesSearch = worksheet.title_ar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      !selectedType || (selectedType === 'linked' && worksheet.episode_id) || (selectedType === 'general' && !worksheet.episode_id);
    return matchesSearch && matchesType;
  });

  // Pagination
  const paginatedWorksheets = filteredWorksheets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    setSelectedWorksheet(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (worksheet) => {
    setSelectedWorksheet(worksheet);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (worksheet) => {
    setSelectedWorksheet(worksheet);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (selectedWorksheet?.id) {
        await updateWorksheet(selectedWorksheet.id, values);
        openSnackbar({
          open: true,
          message: 'تم تحديث ورقة العمل بنجاح',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        await createWorksheet(values);
        openSnackbar({
          open: true,
          message: 'تم إنشاء ورقة العمل بنجاح',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
      worksheetsMutate();
      setFormDialogOpen(false);
      setSelectedWorksheet(null);
    } catch (error) {
      openSnackbar({
        open: true,
        message: error?.message || 'حدث خطأ في العملية',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteWorksheet(selectedWorksheet.id);
      openSnackbar({
        open: true,
        message: 'تم حذف ورقة العمل بنجاح',
        variant: 'alert',
        alert: { color: 'success' }
      });
      worksheetsMutate();
      setDeleteDialogOpen(false);
      setSelectedWorksheet(null);
    } catch (error) {
      openSnackbar({
        open: true,
        message: error?.message || 'حدث خطأ في حذف ورقة العمل',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const getEpisodeName = (episodeId) => {
    if (!episodeId) return '-';
    const episode = episodes.find((ep) => ep.id === episodeId);
    return episode?.title_ar || '-';
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return '-';
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name_ar || '-';
  };

  if (worksheetsLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">أوراق العمل</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateClick}>
            إضافة ورقة عمل
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
                placeholder="بحث عن ورقة عمل..."
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
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(0);
                }}
                placeholder="النوع"
              >
                <MenuItem value="">جميع الأوراق</MenuItem>
                <MenuItem value="linked">مرتبطة بحلقات</MenuItem>
                <MenuItem value="general">عامة</MenuItem>
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
                  <TableCell>الحلقة</TableCell>
                  <TableCell>التصنيف</TableCell>
                  <TableCell align="center">نوع الملف</TableCell>
                  <TableCell align="center">نشط</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedWorksheets.length > 0 ? (
                  paginatedWorksheets.map((worksheet) => (
                    <TableRow key={worksheet.id} hover>
                      <TableCell align="center">
                        {worksheet.thumbnail_image && (
                          <Box
                            component="img"
                            src={worksheet.thumbnail_image}
                            alt={worksheet.title_ar}
                            sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{worksheet.title_ar}</TableCell>
                      <TableCell>{getEpisodeName(worksheet.episode_id)}</TableCell>
                      <TableCell>{getCategoryName(worksheet.category_id)}</TableCell>
                      <TableCell align="center">
                        <Chip label={worksheet.file_type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={worksheet.is_active ? 'نعم' : 'لا'} color={worksheet.is_active ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Button size="small" variant="outlined" onClick={() => handleEditClick(worksheet)} startIcon={<Edit size={16} />}>
                            تحرير
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteClick(worksheet)}
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
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        لا توجد أوراق عمل متطابقة
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
            count={filteredWorksheets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </MainCard>
      </Grid>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedWorksheet?.id ? 'تحرير ورقة العمل' : 'إضافة ورقة عمل جديدة'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <WorksheetForm
            worksheet={selectedWorksheet}
            onSubmit={handleFormSubmit}
            isLoading={formLoading}
            onCancel={() => setFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل تريد بالتأكيد حذف ورقة العمل "{selectedWorksheet?.title_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
