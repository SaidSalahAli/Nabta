import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { useGetEpisodeCategories } from 'api/episodeCategories';

// ==============================|| EPISODE FORM ||============================== //

const validationSchema = Yup.object().shape({
  title_ar: Yup.string().required('عنوان الحلقة مطلوب'),
  slug: Yup.string().required('الرابط النصي مطلوب'),
  category_id: Yup.number().required('التصنيف مطلوب'),
  episode_number: Yup.number().required('رقم الحلقة مطلوب').positive('يجب أن يكون رقم موجب'),
  short_description_ar: Yup.string().required('الوصف القصير مطلوب'),
  description_ar: Yup.string().required('الوصف كامل مطلوب'),
  video_url: Yup.string().required('رابط الفيديو مطلوب').url('رابط الفيديو غير صحيح'),
  video_type: Yup.string().required('نوع الفيديو مطلوب'),
  duration_seconds: Yup.number().required('المدة بالثواني مطلوبة').positive('يجب أن تكون قيمة موجبة'),
  thumbnail_image: Yup.string(),
  cover_image: Yup.string(),
  transcript_ar: Yup.string(),
  is_featured: Yup.boolean(),
  is_published: Yup.boolean(),
  has_worksheets: Yup.boolean(),
  sort_order: Yup.number().min(0, 'يجب أن تكون قيمة موجبة'),
  published_at: Yup.date()
});

export default function EpisodeForm({ episode = null, onSubmit, isLoading = false, onCancel }) {
  const { categories = [] } = useGetEpisodeCategories();
  const [initialValues, setInitialValues] = useState({
    title_ar: '',
    slug: '',
    category_id: '',
    episode_number: '',
    short_description_ar: '',
    description_ar: '',
    video_url: '',
    video_type: 'youtube',
    duration_seconds: '',
    thumbnail_image: '',
    cover_image: '',
    transcript_ar: '',
    is_featured: false,
    is_published: false,
    has_worksheets: false,
    sort_order: 0,
    published_at: ''
  });

  useEffect(() => {
    if (episode) {
      setInitialValues({
        title_ar: episode.title_ar || '',
        slug: episode.slug || '',
        category_id: episode.category_id || '',
        episode_number: episode.episode_number || '',
        short_description_ar: episode.short_description_ar || '',
        description_ar: episode.description_ar || '',
        video_url: episode.video_url || '',
        video_type: episode.video_type || 'youtube',
        duration_seconds: episode.duration_seconds || '',
        thumbnail_image: episode.thumbnail_image || '',
        cover_image: episode.cover_image || '',
        transcript_ar: episode.transcript_ar || '',
        is_featured: episode.is_featured || false,
        is_published: episode.is_published || false,
        has_worksheets: episode.has_worksheets || false,
        sort_order: episode.sort_order || 0,
        published_at: episode.published_at || ''
      });
    }
  }, [episode]);

  const handleFormSubmit = async (values, { setStatus, setSubmitting }) => {
    try {
      await onSubmit(values);
      setStatus({ success: true });
      setSubmitting(false);
    } catch (err) {
      setStatus({ success: false });

      // معالجة أخطاء API
      let errorMessage = 'حدث خطأ في العملية';
      if (err?.errors) {
        // معالجة أخطاء التحقق من البيانات
        const errorKeys = Object.keys(err.errors);
        if (errorKeys.length > 0) {
          errorMessage = err.errors[errorKeys[0]][0] || errorMessage;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.title) {
        errorMessage = err.title;
      }

      openSnackbar({
        open: true,
        message: errorMessage,
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
            {/* Title */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="title_ar">عنوان الحلقة</InputLabel>
                <OutlinedInput
                  id="title_ar"
                  type="text"
                  value={values.title_ar}
                  name="title_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أدخل عنوان الحلقة"
                  fullWidth
                  error={Boolean(touched.title_ar && errors.title_ar)}
                />
                {touched.title_ar && errors.title_ar && (
                  <FormHelperText error id="helper-text-title_ar">
                    {errors.title_ar}
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
                  placeholder="مثال: episode-1"
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

            {/* Category */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="category_id">التصنيف</InputLabel>
                <TextField
                  id="category_id"
                  select
                  value={values.category_id}
                  name="category_id"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.category_id && errors.category_id)}
                  placeholder="اختر التصنيف"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.Id || cat.id} value={cat.Id || cat.id}>
                      {cat.NameAr || cat.name_ar}
                    </MenuItem>
                  ))}
                </TextField>
                {touched.category_id && errors.category_id && (
                  <FormHelperText error id="helper-text-category_id">
                    {errors.category_id}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Episode Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="episode_number">رقم الحلقة</InputLabel>
                <OutlinedInput
                  id="episode_number"
                  type="number"
                  value={values.episode_number}
                  name="episode_number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أدخل رقم الحلقة"
                  fullWidth
                  error={Boolean(touched.episode_number && errors.episode_number)}
                />
                {touched.episode_number && errors.episode_number && (
                  <FormHelperText error id="helper-text-episode_number">
                    {errors.episode_number}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Short Description */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="short_description_ar">الوصف القصير</InputLabel>
                <OutlinedInput
                  id="short_description_ar"
                  type="text"
                  value={values.short_description_ar}
                  name="short_description_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف قصير للحلقة"
                  fullWidth
                  multiline
                  rows={2}
                  error={Boolean(touched.short_description_ar && errors.short_description_ar)}
                />
                {touched.short_description_ar && errors.short_description_ar && (
                  <FormHelperText error id="helper-text-short_description_ar">
                    {errors.short_description_ar}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Full Description */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="description_ar">الوصف كامل</InputLabel>
                <OutlinedInput
                  id="description_ar"
                  type="text"
                  value={values.description_ar}
                  name="description_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف كامل للحلقة"
                  fullWidth
                  multiline
                  rows={4}
                  error={Boolean(touched.description_ar && errors.description_ar)}
                />
                {touched.description_ar && errors.description_ar && (
                  <FormHelperText error id="helper-text-description_ar">
                    {errors.description_ar}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Video URL */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="video_url">رابط الفيديو</InputLabel>
                <OutlinedInput
                  id="video_url"
                  type="url"
                  value={values.video_url}
                  name="video_url"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="https://..."
                  fullWidth
                  error={Boolean(touched.video_url && errors.video_url)}
                />
                {touched.video_url && errors.video_url && (
                  <FormHelperText error id="helper-text-video_url">
                    {errors.video_url}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Video Type */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="video_type">نوع الفيديو</InputLabel>
                <TextField
                  id="video_type"
                  select
                  value={values.video_type}
                  name="video_type"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="vimeo">Vimeo</MenuItem>
                  <MenuItem value="mp4">MP4</MenuItem>
                  <MenuItem value="stream">Stream</MenuItem>
                </TextField>
              </Stack>
            </Grid>

            {/* Duration */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="duration_seconds">المدة بالثواني</InputLabel>
                <OutlinedInput
                  id="duration_seconds"
                  type="number"
                  value={values.duration_seconds}
                  name="duration_seconds"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="مثال: 3600"
                  fullWidth
                  error={Boolean(touched.duration_seconds && errors.duration_seconds)}
                />
                {touched.duration_seconds && errors.duration_seconds && (
                  <FormHelperText error id="helper-text-duration_seconds">
                    {errors.duration_seconds}
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

            {/* Thumbnail Image URL */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="thumbnail_image">رابط الصورة المصغرة</InputLabel>
                <OutlinedInput
                  id="thumbnail_image"
                  type="url"
                  value={values.thumbnail_image}
                  name="thumbnail_image"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="https://..."
                  fullWidth
                  error={Boolean(touched.thumbnail_image && errors.thumbnail_image)}
                />
                {touched.thumbnail_image && errors.thumbnail_image && (
                  <FormHelperText error id="helper-text-thumbnail_image">
                    {errors.thumbnail_image}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Cover Image URL */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="cover_image">رابط صورة الغلاف</InputLabel>
                <OutlinedInput
                  id="cover_image"
                  type="url"
                  value={values.cover_image}
                  name="cover_image"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="https://..."
                  fullWidth
                  error={Boolean(touched.cover_image && errors.cover_image)}
                />
                {touched.cover_image && errors.cover_image && (
                  <FormHelperText error id="helper-text-cover_image">
                    {errors.cover_image}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Transcript */}
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="transcript_ar">نص الحلقة</InputLabel>
                <OutlinedInput
                  id="transcript_ar"
                  type="text"
                  value={values.transcript_ar}
                  name="transcript_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="نص الحلقة كاملاً"
                  fullWidth
                  multiline
                  rows={4}
                  error={Boolean(touched.transcript_ar && errors.transcript_ar)}
                />
              </Stack>
            </Grid>

            {/* Checkboxes */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.is_published}
                      onChange={(e) => setFieldValue('is_published', e.target.checked)}
                      name="is_published"
                    />
                  }
                  label="منشورة"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.is_featured}
                      onChange={(e) => setFieldValue('is_featured', e.target.checked)}
                      name="is_featured"
                    />
                  }
                  label="مميزة"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.has_worksheets}
                      onChange={(e) => setFieldValue('has_worksheets', e.target.checked)}
                      name="has_worksheets"
                    />
                  }
                  label="يوجد أوراق عمل"
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

EpisodeForm.propTypes = {
  episode: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired
};
