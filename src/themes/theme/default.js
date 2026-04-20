// project-imports
import { ThemeMode } from 'config';

// ==============================|| PRESET THEME - DEFAULT ||============================== //

export default function Default(mode) {
  const contrastText = '#fff';

  let primaryColors = ['#D6F0FF', '#A3E0FF', '#70D0FF', '#3DC0FF', '#0AB0F0', '#0088CC', '#006699', '#004D66', '#003352', '#001A33'];
  let secondaryColors = ['#F8F9FA', '#F8F9FA', '#F3F5F7', '#DBE0E5', '#BEC8D0', '#8996A4', '#5B6B79', '#3E4853', '#1D2630', '#131920'];
  let errorColors = ['#f5bebe', '#e76767', '#dc2626', '#d31c1c', '#c50d0d'];
  let warningColors = ['#f7dcb3', '#edad4d', '#e58a00', '#de7700', '#d35a00'];
  let infoColors = ['#c5eff3', '#78d9e2', '#3ec9d6', '#30bccc', '#1ba9bc'];
  let successColors = ['#c0e5d9', '#6bc2a5', '#2ca87f', '#21976c', '#107d4f'];

  if (mode === ThemeMode.DARK) {
    primaryColors = ['#001A33', '#003352', '#004D66', '#006699', '#0088CC', '#0AB0F0', '#3DC0FF', '#70D0FF', '#A3E0FF', '#D6F0FF'];
    secondaryColors = ['#131920', '#1D2630', '#3E4853', '#5B6B79', '#8996A4', '#BEC8D0', '#DBE0E5', '#F3F5F7', '#F8F9FA', '#F8F9FA'];
    errorColors = ['#c50d0d', '#d31c1c', '#dc2626', '#e76767', '#f5bebe'];
    warningColors = ['#d35a00', '#de7700', '#e58a00', '#edad4d', '#f7dcb3'];
    infoColors = ['#1ba9bc', '#30bccc', '#3ec9d6', '#78d9e2', '#c5eff3'];
    successColors = ['#107d4f', '#21976c', '#2ca87f', '#6bc2a5', '#c0e5d9'];
  }

  return {
    primary: {
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9],
      contrastText
    },
    secondary: {
      lighter: secondaryColors[0],
      100: secondaryColors[1],
      200: secondaryColors[2],
      light: secondaryColors[3],
      400: secondaryColors[4],
      500: secondaryColors[5],
      main: secondaryColors[6],
      dark: secondaryColors[7],
      800: secondaryColors[8],
      darker: secondaryColors[9],
      contrastText
    },
    error: {
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
      contrastText
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText
    },
    success: {
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText
    }
  };
}
