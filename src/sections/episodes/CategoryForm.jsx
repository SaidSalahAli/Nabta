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

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';

// ==============================|| CATEGORY FORM ||============================== //

const validationSchema = Yup.object().shape({
  name_ar: Yup.string().required('اسم التصنيف مطلوب'),
  slug: Yup.string().required('الرابط النصي مطلوب'),
  description_ar: Yup.string(),
  image: Yup.string().url('رابط الصورة غير صحيح'),
  sort_order: Yup.number().min(0, 'يجب أن تكون قيمة موجبة'),
  is_active: Yup.boolean()
});

export default function CategoryForm({ category = null, onSubmit, isLoading = false, onCancel }) {
  const [initialValues, setInitialValues] = useState({
    name_ar: '',
    slug: '',
    description_ar: '',
    image: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (category) {
      setInitialValues({
        name_ar: category.name_ar || '',
        slug: category.slug || '',
        description_ar: category.description_ar || '',
        image: category.image || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== undefined ? category.is_active : true
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

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleFormSubmit} enableReinitialize>
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="name_ar">اسم التصنيف</InputLabel>
                <OutlinedInput
                  id="name_ar"
                  type="text"
                  value={values.name_ar}
                  name="name_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أدخل اسم التصنيف"
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

            {/* Slug */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="slug">الرابط النصي</InputLabel>
                <OutlinedInput
                  id="slug"
                  type="text"
                  value={values.slug}
                  name="slug"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="مثال: quran"
                  fullWidth
                  error={Boolean(touched.slug && errors.slug)}
                />
                {touched.slug && errors.slug && (
                  <FormHelperText error id="helper-text-slug">
                    {errors.slug}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="description_ar">الوصف</InputLabel>
                <OutlinedInput
                  id="description_ar"
                  type="text"
                  value={values.description_ar}
                  name="description_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف التصنيف"
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

            {/* Image URL */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="image">رابط الصورة</InputLabel>
                <OutlinedInput
                  id="image"
                  type="url"
                  value={values.image}
                  name="image"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="https://..."
                  fullWidth
                  error={Boolean(touched.image && errors.image)}
                />
                {touched.image && errors.image && (
                  <FormHelperText error id="helper-text-image">
                    {errors.image}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Sort Order */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="sort_order">ترتيب العرض</InputLabel>
                <OutlinedInput
                  id="sort_order"
                  type="number"
                  value={values.sort_order}
                  name="sort_order"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="0"
                  fullWidth
                  error={Boolean(touched.sort_order && errors.sort_order)}
                />
                {touched.sort_order && errors.sort_order && (
                  <FormHelperText error id="helper-text-sort_order">
                    {errors.sort_order}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Active Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', pt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox checked={values.is_active} onChange={(e) => setFieldValue('is_active', e.target.checked)} name="is_active" />
                  }
                  label="نشط"
                />
              </Box>
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
