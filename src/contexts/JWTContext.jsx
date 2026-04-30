import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) return false;
  const decoded = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// استخرج بيانات المستخدم من الـ token مباشرة
const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id || decoded.UserId,
      email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'User'
    };
  } catch {
    return null;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      const minDisplay = 1000;
      const start = Date.now();
      try {
        const serviceToken = localStorage.getItem('serviceToken');

        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);

          const user = getUserFromToken(serviceToken);

          const elapsed = Date.now() - start;
          if (elapsed < minDisplay) await new Promise((r) => setTimeout(r, minDisplay - elapsed));
          dispatch({
            type: LOGIN,
            payload: { isLoggedIn: true, user }
          });
        } else {
          const elapsed = Date.now() - start;
          if (elapsed < minDisplay) await new Promise((r) => setTimeout(r, minDisplay - elapsed));
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error(err);
        const elapsed = Date.now() - start;
        if (elapsed < minDisplay) await new Promise((r) => setTimeout(r, minDisplay - elapsed));
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('api/AccountNabta/Login', { email, password });
    const { accessToken, user } = response.data;
    setSession(accessToken);

    const userFromToken = getUserFromToken(accessToken);

    dispatch({
      type: LOGIN,
      payload: { isLoggedIn: true, user: userFromToken || user }
    });
  };

  const register = async (email, password, firstName, lastName, mobile) => {
    const payload = {
      email,
      password,
      firstName,
      lastName,
      mobail: mobile || ''
    };

    const response = await axios.post('api/AccountNabta/Rigester', payload);

    const data = response.data || response;
    const serviceToken = data.accessToken || data.serviceToken || data.token;
    if (serviceToken) setSession(serviceToken);

    return data;
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email) => {
    console.log('email - ', email);
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
