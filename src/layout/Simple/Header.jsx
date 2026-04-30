import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// material-ui
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// assets
import GooglePlay from 'assets/Home/google-play-badge-logo-svgrepo-com.png';
import Logo from 'components/logo';

import { HambergerMenu } from 'iconsax-react';
import { Link } from 'react-router';

// auth
import useAuth from 'hooks/useAuth';

// ==============================|| HEADER - TOP BAR ||============================== //

function TopBar({ primaryColor, onClose, isVisible }) {
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        px: { xs: 1.5, md: 3 },
        py: { xs: 1.5, md: 1.25 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1.5, md: 2 },
        position: 'relative'
      }}
    >
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '50%',
          flexShrink: 0,
          '&:hover': { color: primaryColor, borderColor: primaryColor, bgcolor: 'action.hover' }
        }}
      >
        X
      </IconButton>

      <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, md: 20 }, color: 'text.primary', lineHeight: 1.3 }}>
          تم إطلاق تطبيق لغتي العربية
        </Typography>
        <Typography sx={{ fontWeight: 400, fontSize: { xs: 11, md: 18 }, color: 'text.secondary', lineHeight: 1.2 }}>
          ابدأ مع طفلك اليوم وحمّله الآن
        </Typography>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <img src={GooglePlay} alt="Google Play" style={{ height: '35px', width: 'auto' }} />
      </Box>
    </Box>
  );
}

// ==============================|| USER MENU ||============================== //

function UserMenu({ user, primaryColor, onLogout }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  const handleDashboardClick = () => {
    setAnchorEl(null);
    navigate('/dashboard/episodes');
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: primaryColor,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
          }
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>{user?.email}</Typography>
        </Box>

        <MenuItem onClick={handleDashboardClick} sx={{ fontSize: 14, py: 1.25 }}>
          {/* <LayoutAlt size={18} style={{ marginRight: 8 }} /> */}
          لوحة التحكم
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onLogout();
          }}
          sx={{ fontSize: 14, py: 1.25, color: 'error.main' }}
        >
          تسجيل الخروج
        </MenuItem>
      </Menu>
    </>
  );
} // ==============================|| HEADER - BOTTOM BAR ||============================== //

const navLinks = ['الصفحة الرئسية', 'حلقات', 'تطبيقات', 'أوراق عمل', 'قصتنا'];

function BottomBar({ primaryColor }) {
  const [activeTab, setActiveTab] = useState(0);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        px: { xs: 1.5, md: 3 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: '4px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: primaryColor, borderRadius: '2px' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Logo to="/" width={90} />
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: primaryColor } }}
        sx={{ minHeight: 48, flex: 1 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {navLinks.map((label, i) => (
          <Tab
            key={label}
            label={label}
            sx={{
              fontSize: { xs: 14, md: 18 },
              fontWeight: activeTab === i ? 600 : 500,
              color: activeTab === i ? primaryColor : 'text.secondary',
              minHeight: 48,
              px: { xs: 1.5, md: 2 },
              textTransform: 'none',
              minWidth: 'auto',
              '&.Mui-selected': { color: primaryColor }
            }}
          />
        ))}
      </Tabs>

      {/* Action Buttons */}
      <Stack direction="row" alignItems="center" gap={1} sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}>
        {['المتجر', 'ادعمنا'].map((label) => (
          <Button
            key={label}
            variant="outlined"
            sx={{
              fontSize: 13,
              fontWeight: 500,
              borderColor: 'divider',
              color: 'text.primary',
              borderRadius: 1,
              px: 1.75,
              py: 0.75,
              textTransform: 'none',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            {label}
          </Button>
        ))}

        <Box sx={{ width: '0.5px', height: 20, bgcolor: 'divider', mx: 0.5 }} />

        {isLoggedIn ? (
          // ✅ لو مسجل دخول — اعرض الـ Avatar مع المنيو
          <UserMenu user={user} primaryColor={primaryColor} onLogout={logout} />
        ) : (
          // ✅ لو مش مسجل — اعرض أزرار دخول وتسجيل
          <>
            <Button
              variant="text"
              component={Link}
              to="/login"
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: 'text.primary',
                borderRadius: 1,
                px: 1.75,
                py: 0.75,
                textTransform: 'none',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              دخول
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/login/register"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                bgcolor: primaryColor,
                color: 'white',
                borderRadius: 1,
                px: 1.75,
                py: 0.75,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: primaryColor, boxShadow: 'none', opacity: 0.85 }
              }}
            >
              تسجيل
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}

// ==============================|| HEADER - MOBILE DRAWER ||============================== //

function MobileDrawer({ open, onClose, primaryColor }) {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <Drawer anchor="top" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { backgroundImage: 'none' } }}>
      <Box sx={{ p: 3 }}>
        {/* لو مسجل دخول اعرض بياناته */}
        {isLoggedIn && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Avatar sx={{ bgcolor: primaryColor, width: 40, height: 40, fontSize: 14, fontWeight: 700 }}>
              {`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{user?.email}</Typography>
            </Box>
          </Box>
        )}

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navLinks.map((label) => (
            <ListItemButton key={label} sx={{ px: 0, borderRadius: 1 }}>
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 500, fontSize: 16 } } }} />
            </ListItemButton>
          ))}
        </List>

        <Stack gap={1} mt={2}>
          {['المتجر', 'ادعمنا'].map((label) => (
            <Button key={label} variant="outlined" fullWidth sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.primary' }}>
              {label}
            </Button>
          ))}

          {isLoggedIn ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                logout();
                onClose();
              }}
              sx={{ textTransform: 'none', bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
            >
              تسجيل الخروج
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/login"
                sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.primary' }}
              >
                دخول
              </Button>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/login/register"
                sx={{ textTransform: 'none', bgcolor: primaryColor, '&:hover': { bgcolor: primaryColor, opacity: 0.85 } }}
              >
                تسجيل
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}

// ==============================|| MAIN HEADER EXPORT ||============================== //

export default function Header() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const primaryColor = theme.palette.primary.main;

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', boxShadow: 'none', color: 'text.primary' }}>
      {/* Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TopBar primaryColor={primaryColor} onClose={() => setIsTopBarVisible(false)} isVisible={isTopBarVisible} />
        <BottomBar primaryColor={primaryColor} />
      </Box>

      {/* Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <TopBar primaryColor={primaryColor} onClose={() => setIsTopBarVisible(false)} isVisible={isTopBarVisible} />
        <Container disableGutters>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, height: 24 }}>
              <Logo to="/" width={60} />
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary', flex: 1, textAlign: 'center' }}>
              لغتي العربية
            </Typography>
            <IconButton size="large" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ flexShrink: 0 }}>
              <HambergerMenu />
            </IconButton>
          </Toolbar>
        </Container>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} primaryColor={primaryColor} />
      </Box>
    </AppBar>
  );
}
