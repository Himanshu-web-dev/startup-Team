// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
const TokenManager = {
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },
  
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },
  
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// API Request wrapper with automatic token refresh
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = TokenManager.getAccessToken();
  
  // Default headers
  const headers = {
    ...options.headers
  };
  
  // Add Authorization header if token exists
  if (accessToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  // Add Content-Type for JSON requests
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  try {
    let response = await fetch(url, {
      ...options,
      headers,
      body: options.body instanceof FormData ? options.body : JSON.stringify(options.body)
    });
    
    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && TokenManager.getRefreshToken() && !options.skipRefresh) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        headers['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
        response = await fetch(url, {
          ...options,
          headers,
          body: options.body instanceof FormData ? options.body : JSON.stringify(options.body)
        });
      } else {
        // Refresh failed, redirect to login
        handleAuthError();
        return null;
      }
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Refresh access token
async function refreshAccessToken() {
  try {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// Handle authentication errors
function handleAuthError() {
  TokenManager.clearTokens();
  window.location.href = '/pages/login.html?error=session_expired';
}

// API Methods
const API = {
  // Authentication
  auth: {
    async register(userData) {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: userData,
        skipAuth: true
      });
    },
    
    async verifyEmail(email, otp) {
      return apiRequest('/auth/verify-email', {
        method: 'POST',
        body: { email, otp },
        skipAuth: true
      });
    },
    
    async login(email, password) {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
        skipAuth: true
      });
      
      if (response && response.success) {
        TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    },
    
    async logout() {
      const refreshToken = TokenManager.getRefreshToken();
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: { refreshToken }
      });
      TokenManager.clearTokens();
    },
    
    async forgotPassword(email) {
      return apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email },
        skipAuth: true
      });
    },
    
    async resetPassword(token, password) {
      return apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { token, password },
        skipAuth: true
      });
    },
    
    async getMe() {
      return apiRequest('/auth/me');
    }
  },
  
  // Founder APIs
  founder: {
    async getProfile() {
      return apiRequest('/founder/profile');
    },
    
    async updateProfile(profileData) {
      return apiRequest('/founder/profile', {
        method: 'PUT',
        body: profileData
      });
    },
    
    async createStartup(startupData) {
      return apiRequest('/founder/startup', {
        method: 'POST',
        body: startupData
      });
    },
    
    async getStartup() {
      return apiRequest('/founder/startup');
    },
    
    async updateStartup(id, startupData) {
      return apiRequest(`/founder/startup/${id}`, {
        method: 'PUT',
        body: startupData
      });
    },
    
    async createRole(roleData) {
      return apiRequest('/founder/roles', {
        method: 'POST',
        body: roleData
      });
    },
    
    async getRoles() {
      return apiRequest('/founder/roles');
    },
    
    async updateRole(id, roleData) {
      return apiRequest(`/founder/roles/${id}`, {
        method: 'PUT',
        body: roleData
      });
    },
    
    async deleteRole(id) {
      return apiRequest(`/founder/roles/${id}`, {
        method: 'DELETE'
      });
    },
    
    async getApplications(status = null) {
      const query = status ? `?status=${status}` : '';
      return apiRequest(`/founder/applications${query}`);
    },
    
    async acceptApplication(id, notes = '') {
      return apiRequest(`/founder/applications/${id}/accept`, {
        method: 'PUT',
        body: { notes }
      });
    },
    
    async rejectApplication(id, notes = '') {
      return apiRequest(`/founder/applications/${id}/reject`, {
        method: 'PUT',
        body: { notes }
      });
    },
    
    async getDashboard() {
      return apiRequest('/founder/dashboard');
    }
  },
  
  // Member APIs
  member: {
    async getProfile() {
      return apiRequest('/member/profile');
    },
    
    async updateProfile(profileData) {
      return apiRequest('/member/profile', {
        method: 'PUT',
        body: profileData
      });
    },
    
    async exploreStartups(filters = {}) {
      const queryParams = new URLSearchParams(filters).toString();
      return apiRequest(`/member/startups?${queryParams}`);
    },
    
    async getStartupDetails(id) {
      return apiRequest(`/member/startups/${id}`);
    },
    
    async applyToRole(roleId, coverLetter = '') {
      return apiRequest('/member/applications', {
        method: 'POST',
        body: { roleId, coverLetter }
      });
    },
    
    async getMyApplications(status = null) {
      const query = status ? `?status=${status}` : '';
      return apiRequest(`/member/applications${query}`);
    },
    
    async cancelApplication(id) {
      return apiRequest(`/member/applications/${id}`, {
        method: 'DELETE'
      });
    },
    
    async saveStartup(id) {
      return apiRequest(`/member/startups/${id}/save`, {
        method: 'POST'
      });
    },
    
    async unsaveStartup(id) {
      return apiRequest(`/member/startups/${id}/save`, {
        method: 'DELETE'
      });
    },
    
    async getSavedStartups() {
      return apiRequest('/member/startups/saved');
    },
    
    async getDashboard() {
      return apiRequest('/member/dashboard');
    }
  },
  
  // Upload APIs
  upload: {
    async uploadAvatar(file) {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return apiRequest('/upload/avatar', {
        method: 'POST',
        body: formData
      });
    },
    
    async uploadStartupLogo(file) {
      const formData = new FormData();
      formData.append('logo', file);
      
      return apiRequest('/upload/startup-logo', {
        method: 'POST',
        body: formData
      });
    }
  }
};

// Check if user is authenticated
function isAuthenticated() {
  return !!TokenManager.getAccessToken();
}

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Protect pages that require authentication
function protectPage(requiredRole = null) {
  if (!isAuthenticated()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  
  if (requiredRole) {
    const user = getCurrentUser();
    if (user && user.role !== requiredRole) {
      window.location.href = '/pages/login.html?error=unauthorized';
      return false;
    }
  }
  
  return true;
}
