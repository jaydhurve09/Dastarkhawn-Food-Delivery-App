import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('adminToken');
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, {
      email,
      password
    }, {
      withCredentials: true, // Important for sending/receiving cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.token) {
      // Store the token in localStorage or a more secure storage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

const logout = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    // Call backend logout endpoint
    const response = await axios.post(
      `${API_URL}/admin/logout`, 
      {},
      {
        withCredentials: true, // Important for cookies
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Only clear local storage if the request was successful
    if (response.data.success) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Clear any existing cookies
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return response.data;
    }
    
    throw new Error(response.data.message || 'Logout failed');
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    // Even if the API call fails, we should still clear local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    throw error;
  }
};

const getCurrentUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

const createSubAdmin = async (adminData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${'http://localhost:5000/api'}/admins/subadmins`,
      adminData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Create sub-admin error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to create sub-admin';
  }
};

const updateSubAdmin = async (id, adminData) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `http://localhost:5000/api/admins/${id}`,
      adminData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Update sub-admin error:', error.response?.data?.message || error.message);
    console.error('Full error:', error);
    throw error.response?.data?.message || 'Failed to update sub-admin';
  }
};

const getSubAdmins = async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      'http://localhost:5000/api/admins/subadmins',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get sub-admins error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to fetch sub-admins';
  }
};

// Request password reset
const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/forgot-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to process password reset request.';
  }
};

// Reset password with token
const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/reset-password/${token}`,
      { password, passwordConfirm },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Failed to reset password. The link may have expired.';
  }
};

export const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  createSubAdmin,
  updateSubAdmin,
  getSubAdmins,
  requestPasswordReset,
  resetPassword
};

export {
  login,
  logout,
  getCurrentUser,
  getAuthToken,
  getToken,
  createSubAdmin,
  updateSubAdmin,
  getSubAdmins
};

export default {
  login,
  logout,
  getCurrentUser,
  getAuthToken,
  getToken,
  createSubAdmin,
  updateSubAdmin,
  getSubAdmins
};
