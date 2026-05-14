import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { uploadMedia } from 'api/media';

// assets
import { DirectUp, Trash } from 'iconsax-react';

// ==============================|| CATEGORY FORM ||============================== //

const validationSchema = Yup.object().shape({
  name_ar: Yup.string().required('اسم التصنيف بالعربية مطلوب'),
  name_en: Yup.string().required('اسم التصنيف بالإنجليزية مطلوب'),
  description_ar: Yup.string(),
  description_en: Yup.string(),
  cover_image: Yup.string(),
  display_order: Yup.number().min(0),
  is_active: Yup.boolean()
});

export default function CategoryForm({ category = null, onSubmit, isLoading = false, onCancel }) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    icon_url: '',
    cover_image: '',
    color_code: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (category) {
      setInitialValues({
        name_ar: category.name_ar || category.NameAr || category.nameAr || '',
        name_en: category.name_en || category.NameEn || category.nameEn || '',
        description_ar: category.description_ar || category.DescriptionAr || category.descriptionAr || '',
        description_en: category.description_en || category.DescriptionEn || category.descriptionEn || '',
        icon_url: category.icon_url || category.IconUrl || category.Image || category.image || '',
        cover_image: category.cover_image || category.CoverImage || '',
        color_code: category.color_code || category.ColorCode || '',
        display_order: category.display_order ?? category.DisplayOrder ?? 0,
        is_active: category.is_active !== undefined ? Boolean(category.is_active) : category.IsActive !== undefined ? Boolean(category.IsActive) : true
      });
    }
  }, [category]);

  const handleFormSubmit = async (values, { setStatus, setSubmitting }) => {
    try {
      await onSubmit(values);
      setStatus({ success: true });
      setSubmitting(false);
    } catch (err) {
      setStatus({ success: false });
      openSnackbar({
        open: true,
        message: err?.message || 'حدث خطأ في العملية',
        variant: 'alert',
        alert: { color: 'error' }
      });
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e, field, setFieldValue, setUploading) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadMedia(file);
      if (response.success) {
        const fileUrl = response.data.file_path;
        setFieldValue(field, fileUrl);
        openSnackbar({
          open: true,
          message: 'تم رفع الملف بنجاح',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'فشل رفع الملف',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleFormSubmit} enableReinitialize>
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* Name AR */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="name_ar">اسم التصنيف (العربية) *</InputLabel>
                <OutlinedInput
                  id="name_ar"
                  type="text"
                  value={values.name_ar}
                  name="name_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أدخل اسم التصنيف بالعربية"
                  fullWidth
                  error={Boolean(touched.name_ar && errors.name_ar)}
                />
                {touched.name_ar && errors.name_ar && (
                  <FormHelperText error id="helper-text-name_ar">
                    {errors.name_ar}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Name EN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="name_en">اسم التصنيف (الإنجليزية) *</InputLabel>
                <OutlinedInput
                  id="name_en"
                  type="text"
                  value={values.name_en}
                  name="name_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Category name in English"
                  fullWidth
                  error={Boolean(touched.name_en && errors.name_en)}
                />
                {touched.name_en && errors.name_en && (
                  <FormHelperText error id="helper-text-name_en">
                    {errors.name_en}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Description AR */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="description_ar">الوصف (العربية)</InputLabel>
                <OutlinedInput
                  id="description_ar"
                  type="text"
                  value={values.description_ar}
                  name="description_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف التصنيف بالعربية"
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(touched.description_ar && errors.description_ar)}
                />
                {touched.description_ar && errors.description_ar && (
                  <FormHelperText error id="helper-text-description_ar">
                    {errors.description_ar}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Description EN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="description_en">الوصف (الإنجليزية)</InputLabel>
                <OutlinedInput
                  id="description_en"
                  type="text"
                  value={values.description_en}
                  name="description_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Category description in English"
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(touched.description_en && errors.description_en)}
                />
                {touched.description_en && errors.description_en && (
                  <FormHelperText error id="helper-text-description_en">
                    {errors.description_en}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>


            {/* Cover Image URL */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="cover_image">صورة الغلاف</InputLabel>
                <Stack direction="row" spacing={2} alignItems="center">
                  {values.cover_image && (
                    <Box sx={{ position: 'relative', width: 100, height: 60 }}>
                      <Box
                        component="img"
                        src={values.cover_image.startsWith('http') ? values.cover_image : `${import.meta.env.VITE_APP_API_URL}${values.cover_image}`}
                        alt="cover"
                        sx={{ width: '100%', height: '100%', borderRadius: 1, objectFit: 'cover' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        sx={{ position: 'absolute', top: -10, right: -10, minWidth: 24, width: 24, height: 24, p: 0, borderRadius: '50%' }}
                        onClick={() => setFieldValue('cover_image', '')}
                      >
                        <Trash size="12" variant="Bold" />
                      </Button>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<DirectUp size="20" />}
                    disabled={isUploadingCover}
                    sx={{ height: 40 }}
                  >
                    {isUploadingCover ? 'جاري الرفع...' : 'رفع غلاف'}
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'cover_image', setFieldValue, setIsUploadingCover)} />
                  </Button>
                </Stack>
                {touched.cover_image && errors.cover_image && (
                  <FormHelperText error id="helper-text-cover_image">
                    {errors.cover_image}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>


            {/* Display Order */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="display_order">ترتيب العرض</InputLabel>
                <OutlinedInput
                  id="display_order"
                  type="number"
                  value={values.display_order}
                  name="display_order"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="0"
                  fullWidth
                  inputProps={{ min: 0 }}
                  error={Boolean(touched.display_order && errors.display_order)}
                />
                {touched.display_order && errors.display_order && (
                  <FormHelperText error id="helper-text-display_order">
                    {errors.display_order}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* is_active */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.is_active}
                    onChange={(e) => setFieldValue('is_active', e.target.checked)}
                    name="is_active"
                  />
                }
                label={<Typography variant="body2">التصنيف مفعّل (ظاهر للزوار)</Typography>}
              />
            </Grid>

            {/* Form Actions */}
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="secondary" onClick={onCancel}>
                  إلغاء
                </Button>
                <AnimateButton>
                  <Button disableElevation disabled={isLoading} fullWidth={false} size="large" type="submit" variant="contained">
                    {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                  </Button>
                </AnimateButton>
              </Stack>
            </Grid>

          </Grid>
        </form>
      )}
    </Formik>
  );
}

CategoryForm.propTypes = {
  category: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired
};
