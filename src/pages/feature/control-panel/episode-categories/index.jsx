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

// project-imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { useGetEpisodeCategories, deleteEpisodeCategory } from 'api/episodeCategories';
import { openSnackbar } from 'api/snackbar';
import CategoryForm from 'sections/episodes/CategoryForm';
import { createEpisodeCategory, updateEpisodeCategory } from 'api/episodeCategories';

// assets
import { Edit, Trash, Add } from 'iconsax-react';

// ==============================|| EPISODE CATEGORIES ||============================== //

export default function EpisodeCategories() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { categories = [], categoriesLoading, categoriesMutate } = useGetEpisodeCategories();

  // Filter categories
  const filteredCategories = categories.filter((category) => category.name_ar.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const paginatedCategories = filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    setSelectedCategory(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (selectedCategory?.id) {
        await updateEpisodeCategory(selectedCategory.id, values);
        openSnackbar({
          open: true,
          message: 'تم تحديث التصنيف بنجاح',
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        await createEpisodeCategory(values);
        openSnackbar({
          open: true,
          message: 'تم إنشاء التصنيف بنجاح',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
      categoriesMutate();
      setFormDialogOpen(false);
      setSelectedCategory(null);
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
      await deleteEpisodeCategory(selectedCategory.id);
      openSnackbar({
        open: true,
        message: 'تم حذف التصنيف بنجاح',
        variant: 'alert',
        alert: { color: 'success' }
      });
      categoriesMutate();
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      openSnackbar({
        open: true,
        message: error?.message || 'حدث خطأ في حذف التصنيف',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  if (categoriesLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">تصنيفات الحلقات</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateClick}>
            إضافة تصنيف
          </Button>
        </Stack>
      </Grid>

      {/* Search */}
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <TextField
            fullWidth
            placeholder="بحث عن تصنيف..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </MainCard>
      </Grid>

      {/* Table */}
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">الصورة</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الوصف</TableCell>
                  <TableCell align="center">النشاط</TableCell>
                  <TableCell align="center">الترتيب</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell align="center">
                        {category.image && (
                          <Box
                            component="img"
                            src={category.image}
                            alt={category.name_ar}
                            sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{category.name_ar}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {category.description_ar}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={category.is_active ? 'نشط' : 'غير نشط'}
                          color={category.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{category.sort_order}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Button size="small" variant="outlined" onClick={() => handleEditClick(category)} startIcon={<Edit size={16} />}>
                            تحرير
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteClick(category)}
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
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        لا توجد تصنيفات متطابقة
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
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </MainCard>
      </Grid>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCategory?.id ? 'تحرير التصنيف' : 'إضافة تصنيف جديد'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CategoryForm
            category={selectedCategory}
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
          <DialogContentText>هل تريد بالتأكيد حذف التصنيف "{selectedCategory?.name_ar}"؟ لا يمكن التراجع عن هذا الإجراء.</DialogContentText>
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
