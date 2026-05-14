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
import { uploadMedia } from 'api/media';

// assets
import { DirectUp, Trash } from 'iconsax-react';

// ==============================|| EPISODE FORM ||============================== //

const validationSchema = Yup.object().shape({
  title_ar: Yup.string().required('عنوان الحلقة (العربية) مطلوب'),
  title_en: Yup.string().required('عنوان الحلقة (الإنجليزية) مطلوب'),
  category_id: Yup.number().required('التصنيف مطلوب'),
  episode_number: Yup.number().nullable(),
  short_description_ar: Yup.string(),
  short_description_en: Yup.string(),
  description_ar: Yup.string(),
  description_en: Yup.string(),
  transcript_ar: Yup.string(),
  transcript_en: Yup.string(),
  video_url: Yup.string().required('رابط الفيديو مطلوب').url('رابط الفيديو غير صحيح'),
  video_type: Yup.string().oneOf(['youtube', 'vimeo', 'mp4', 'stream']),
  duration_seconds: Yup.number().nullable(),
  cover_image: Yup.string().required('صورة الغلاف مطلوبة'),
  thumbnail_image: Yup.string(),
  author: Yup.string(),
  sort_order: Yup.number(),
  has_worksheets: Yup.boolean(),
  is_featured: Yup.boolean(),
  is_published: Yup.boolean(),
  published_at: Yup.date().nullable(),
  seo_title: Yup.string(),
  seo_description: Yup.string(),
  seo_keywords: Yup.string(),
  series_id: Yup.number().nullable()
});

export default function EpisodeForm({ episode = null, onSubmit, isLoading = false, onCancel }) {
  const { categories = [] } = useGetEpisodeCategories();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title_ar: '',
    title_en: '',
    category_id: '',
    episode_number: '',
    short_description_ar: '',
    short_description_en: '',
    description_ar: '',
    description_en: '',
    transcript_ar: '',
    transcript_en: '',
    video_url: '',
    video_type: 'youtube',
    duration_seconds: '',
    cover_image: '',
    thumbnail_image: '',
    author: '',
    sort_order: 0,
    is_featured: false,
    is_published: false,
    has_worksheets: false,
    published_at: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    series_id: ''
  });

  useEffect(() => {
    if (episode) {
      setInitialValues({
        title_ar: episode.title_ar || '',
        title_en: episode.title_en || '',
        category_id: episode.category_id || '',
        episode_number: episode.episode_number || '',
        short_description_ar: episode.short_description_ar || '',
        short_description_en: episode.short_description_en || '',
        description_ar: episode.description_ar || '',
        description_en: episode.description_en || '',
        video_url: episode.video_url || '',
        video_type: episode.video_type || 'youtube',
        duration_seconds: episode.duration_seconds || '',
        thumbnail_image: episode.thumbnail_image || '',
        cover_image: episode.cover_image || '',
        transcript_ar: episode.transcript_ar || '',
        transcript_en: episode.transcript_en || '',
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

  const handleFileUpload = async (e, field, setFieldValue, setUploading) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadMedia(file);
      if (response.success) {
        // Construct full URL if needed, but the API returns the path starting with /uploads
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
            {/* Title AR */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="title_ar">عنوان الحلقة (العربية) *</InputLabel>
                <OutlinedInput
                  id="title_ar"
                  type="text"
                  value={values.title_ar}
                  name="title_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أدخل عنوان الحلقة بالعربية"
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

            {/* Title EN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="title_en">عنوان الحلقة (الإنجليزية) *</InputLabel>
                <OutlinedInput
                  id="title_en"
                  type="text"
                  value={values.title_en}
                  name="title_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter episode title in English"
                  fullWidth
                  error={Boolean(touched.title_en && errors.title_en)}
                />
                {touched.title_en && errors.title_en && (
                  <FormHelperText error id="helper-text-title_en">
                    {errors.title_en}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="category_id">التصنيف *</InputLabel>
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
                <InputLabel htmlFor="episode_number">رقم الحلقة *</InputLabel>
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

            {/* Short Description AR */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="short_description_ar">الوصف القصير (العربية) *</InputLabel>
                <OutlinedInput
                  id="short_description_ar"
                  type="text"
                  value={values.short_description_ar}
                  name="short_description_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف قصير بالعربية"
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

            {/* Short Description EN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="short_description_en">الوصف القصير (الإنجليزية) *</InputLabel>
                <OutlinedInput
                  id="short_description_en"
                  type="text"
                  value={values.short_description_en}
                  name="short_description_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Brief description in English"
                  fullWidth
                  multiline
                  rows={2}
                  error={Boolean(touched.short_description_en && errors.short_description_en)}
                />
                {touched.short_description_en && errors.short_description_en && (
                  <FormHelperText error id="helper-text-short_description_en">
                    {errors.short_description_en}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Full Description AR */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="description_ar">الوصف الكامل (العربية) *</InputLabel>
                <OutlinedInput
                  id="description_ar"
                  type="text"
                  value={values.description_ar}
                  name="description_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="وصف كامل بالعربية"
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

            {/* Full Description EN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="description_en">الوصف الكامل (الإنجليزية) *</InputLabel>
                <OutlinedInput
                  id="description_en"
                  type="text"
                  value={values.description_en}
                  name="description_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Full description in English"
                  fullWidth
                  multiline
                  rows={4}
                  error={Boolean(touched.description_en && errors.description_en)}
                />
                {touched.description_en && errors.description_en && (
                  <FormHelperText error id="helper-text-description_en">
                    {errors.description_en}
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

            {/* Cover Image URL - REQUIRED */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="cover_image">صورة الغلاف (مطلوب) *</InputLabel>
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
                    {isUploadingCover ? 'جاري الرفع...' : 'رفع صورة'}
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

            {/* Thumbnail Image URL */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="thumbnail_image">الصورة المصغرة</InputLabel>
                <Stack direction="row" spacing={2} alignItems="center">
                  {values.thumbnail_image && (
                    <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                      <Box
                        component="img"
                        src={values.thumbnail_image.startsWith('http') ? values.thumbnail_image : `${import.meta.env.VITE_APP_API_URL}${values.thumbnail_image}`}
                        alt="thumbnail"
                        sx={{ width: '100%', height: '100%', borderRadius: 1, objectFit: 'cover' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        sx={{ position: 'absolute', top: -10, right: -10, minWidth: 24, width: 24, height: 24, p: 0, borderRadius: '50%' }}
                        onClick={() => setFieldValue('thumbnail_image', '')}
                      >
                        <Trash size="12" variant="Bold" />
                      </Button>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<DirectUp size="20" />}
                    disabled={isUploadingThumb}
                    sx={{ height: 40 }}
                  >
                    {isUploadingThumb ? 'جاري الرفع...' : 'رفع صورة'}
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail_image', setFieldValue, setIsUploadingThumb)} />
                  </Button>
                </Stack>
                {touched.thumbnail_image && errors.thumbnail_image && (
                  <FormHelperText error id="helper-text-thumbnail_image">
                    {errors.thumbnail_image}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Transcript AR */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="transcript_ar">نص الحلقة (العربية)</InputLabel>
                <OutlinedInput
                  id="transcript_ar"
                  type="text"
                  value={values.transcript_ar}
                  name="transcript_ar"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="نص الحلقة الكامل بالعربية"
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(touched.transcript_ar && errors.transcript_ar)}
                />
              </Stack>
            </Grid>

            {/* Transcript EN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <InputLabel htmlFor="transcript_en">نص الحلقة (الإنجليزية)</InputLabel>
                <OutlinedInput
                  id="transcript_en"
                  type="text"
                  value={values.transcript_en}
                  name="transcript_en"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Episode transcript in English"
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(touched.transcript_en && errors.transcript_en)}
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
