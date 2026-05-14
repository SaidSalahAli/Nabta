import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project-imports
import { openSnackbar } from 'api/snackbar';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { Eye, EyeSlash } from 'iconsax-react';

export default function AuthRegister() {
  const { register } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        mobail: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstname: Yup.string().max(255).required('الاسم الأول مطلوب'),
        lastname: Yup.string().max(255).required('الاسم الأخير مطلوب'),
        email: Yup.string().email('البريد الإلكتروني غير صحيح').max(255).required('البريد الإلكتروني مطلوب'),
        mobail: Yup.string()
          .matches(/^[0-9]+$/, 'رقم الهاتف غير صحيح')
          .min(10, 'رقم الهاتف قصير')
          .required('رقم الهاتف مطلوب'),
        password: Yup.string()
          .required('كلمة المرور مطلوبة')
          .test('no-leading-trailing-whitespace', 'كلمة المرور لا يمكن أن تبدأ أو تنتهي بمسافة', (value) => value === value?.trim())
          .max(10, 'كلمة المرور يجب أن تكون أقل من 10 أحرف')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await register(values.email.trim(), values.password, values.firstname, values.lastname, values.mobail);

          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            openSnackbar({
              open: true,
              message: 'تم إنشاء الحساب بنجاح!',
              variant: 'alert',
              alert: { color: 'success' }
            });
            setTimeout(() => navigate('/auth/login', { replace: true }), 1500);
          }
        } catch (err) {
          console.error(err.errors.Mobail);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.errors.Mobail || 'حدث خطأ، حاول مرة أخرى' });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="firstname-signup">الاسم الأول *</InputLabel>
                <OutlinedInput
                  id="firstname-signup"
                  value={values.firstname}
                  name="firstname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="محمد"
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
                />
              </Stack>
              {touched.firstname && errors.firstname && <FormHelperText error>{errors.firstname}</FormHelperText>}
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="lastname-signup">الاسم الأخير *</InputLabel>
                <OutlinedInput
                  id="lastname-signup"
                  value={values.lastname}
                  name="lastname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="أحمد"
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                />
              </Stack>
              {touched.lastname && errors.lastname && <FormHelperText error>{errors.lastname}</FormHelperText>}
            </Grid>

            {/* Email */}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="email-signup">البريد الإلكتروني *</InputLabel>
                <OutlinedInput
                  id="email-signup"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </Grid>

            {/* mobail */}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="mobail-signup">رقم الهاتف *</InputLabel>
                <OutlinedInput
                  id="mobail-signup"
                  type="tel"
                  value={values.mobail}
                  name="mobail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="01006300000"
                  fullWidth
                  error={Boolean(touched.mobail && errors.mobail)}
                />
              </Stack>
              {touched.mobail && errors.mobail && <FormHelperText error>{errors.mobail}</FormHelperText>}
            </Grid>

            {/* Password */}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-signup">كلمة المرور *</InputLabel>
                <OutlinedInput
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" color="secondary">
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                />
              </Stack>
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                  <Grid>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            {/* Terms */}
            <Grid size={12}>
              <Typography variant="body2">
                بالتسجيل، أنت توافق على &nbsp;
                <Link variant="subtitle2" component={RouterLink} to="#">
                  شروط الخدمة
                </Link>
                &nbsp; و &nbsp;
                <Link variant="subtitle2" component={RouterLink} to="#">
                  سياسة الخصوصية
                </Link>
              </Typography>
            </Grid>

            {/* Submit Error */}
            {errors.submit && (
              <Grid size={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid size={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  إنشاء حساب
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
