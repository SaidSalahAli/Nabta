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
  nameAr: Yup.string().required('اسم التصنيف مطلوب'),
  descriptionAr: Yup.string(),
  image: Yup.string()
});

export default function CategoryForm({ category = null, onSubmit, isLoading = false, onCancel }) {
  const [initialValues, setInitialValues] = useState({
    nameAr: '',
    descriptionAr: '',
    image: ''
  });

  useEffect(() => {
    if (category) {
      setInitialValues({
        nameAr: category.NameAr || category.nameAr || '',
        descriptionAr: category.DescriptionAr || category.descriptionAr || '',
        image: category.Image || category.image || ''
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
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="nameAr">اسم التصنيف</InputLabel>
                <OutlinedInput
                  id="nameAr"
                  type="text"
                  value={values.nameAr}
                  name="nameAr"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أدخل اسم التصنيف"
                  fullWidth
                  error={Boolean(touched.nameAr && errors.nameAr)}
                />
                {touched.nameAr && errors.nameAr && (
                  <FormHelperText error id="helper-text-nameAr">
                    {errors.nameAr}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="descriptionAr">الوصف</InputLabel>
                <OutlinedInput
                  id="descriptionAr"
                  type="text"
                  value={values.descriptionAr}
                  name="descriptionAr"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف التصنيف"
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(touched.descriptionAr && errors.descriptionAr)}
                />
                {touched.descriptionAr && errors.descriptionAr && (
                  <FormHelperText error id="helper-text-descriptionAr">
                    {errors.descriptionAr}
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
