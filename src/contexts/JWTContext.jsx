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

const setSession = (serviceToken, refreshToken = null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// استخرج بيانات المستخدم من الـ token مباشرة
const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id || decoded.sub || decoded.UserId,
      email: decoded.email || '',
      name: decoded.name || '',
      role: decoded.role || 'user'
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
    try {
      const response = await axios.post('v1/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data.data;

      setSession(accessToken, refreshToken);

      const userFromToken = getUserFromToken(accessToken);

      dispatch({
        type: LOGIN,
        payload: { isLoggedIn: true, user: userFromToken || user }
      });

      return { success: true, user: userFromToken || user };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: LOGOUT });
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const payload = {
        email,
        password,
        name
      };

      const response = await axios.post('v1/auth/register', payload);

      const { accessToken, refreshToken, user } = response.data.data;
      if (accessToken) {
        setSession(accessToken, refreshToken);

        const userFromToken = getUserFromToken(accessToken);
        dispatch({
          type: LOGIN,
          payload: { isLoggedIn: true, user: userFromToken || user }
        });
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('serviceToken');
      if (token) {
        await axios.post('v1/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSession(null);
      dispatch({ type: LOGOUT });
    }
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
