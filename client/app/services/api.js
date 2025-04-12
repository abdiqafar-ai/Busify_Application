import axios from "axios";

// Base URL is hardcoded to http://127.0.0.1:5000/api
const API_BASE_URL = "http://127.0.0.1:5000";

class ApiService {
  constructor() {
    if (typeof window !== "undefined") {
      // Only access sessionStorage in the browser
      this.accessToken = sessionStorage.getItem("access_token");
      this.refreshToken = sessionStorage.getItem("refresh_token");
    } else {
      this.accessToken = null;
      this.refreshToken = null;
    }

    // Create an Axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    // Setup Axios interceptors
    this._setupInterceptors();
  }

  /**
   * Store tokens in sessionStorage and update local variables.
   * @param {string} accessToken - The access token.
   * @param {string} refreshToken - The refresh token.
   */
  storeTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("refresh_token", refreshToken);
    }
  }

  /**
   * Clear tokens from sessionStorage and reset local variables.
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
    }
  }

  /**
   * Setup Axios interceptors for request and response handling.
   */
  _setupInterceptors() {
    // Request interceptor to add Authorization header
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor for error handling and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration (401 Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevent infinite loops
          const success = await this._refreshToken();
          if (success) {
            return this.axiosInstance(originalRequest);
          } else {
            this.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login"; // Redirect to login on failure
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Attempt to refresh the access token using the refresh token.
   * @returns {Promise<boolean>} - Returns true if successful, false otherwise.
   */
  async _refreshToken() {
    if (!this.refreshToken) return false;

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: this.refreshToken,
      });

      if (res.status === 200) {
        const { access_token } = res.data;
        this.storeTokens(access_token, this.refreshToken);
        return true;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }

    return false;
  }

  /**
   * Generic request handler for API calls.
   * @param {string} method - HTTP method (get, post, put, delete).
   * @param {string} endpoint - API endpoint (relative to baseURL).
   * @param {Object|null} data - Request body for POST/PUT requests.
   * @param {Object|null} params - Query parameters for GET requests.
   * @returns {Promise<any>} - The response data.
   */
  async request(method, endpoint, data = null, params = null) {
    try {
      const res = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        params,
      });
      return res.data;
    } catch (err) {
      console.error(`API ${method.toUpperCase()} ${endpoint} failed:`, err);
      if (err.response?.data?.msg) {
        throw new Error(err.response.data.msg);
      }
      throw new Error("An unexpected error occurred.");
    }
  }

  /**
   * Wrapper for GET requests.
   * @param {string} endpoint - API endpoint.
   * @param {Object|null} params - Query parameters.
   * @returns {Promise<any>} - The response data.
   */
  get(endpoint, params) {
    return this.request("get", endpoint, null, params);
  }

  /**
   * Wrapper for POST requests.
   * @param {string} endpoint - API endpoint.
   * @param {Object} data - Request body.
   * @returns {Promise<any>} - The response data.
   */
  post(endpoint, data) {
    return this.request("post", endpoint, data);
  }

  /**
   * Wrapper for PUT requests.
   * @param {string} endpoint - API endpoint.
   * @param {Object} data - Request body.
   * @returns {Promise<any>} - The response data.
   */
  put(endpoint, data) {
    return this.request("put", endpoint, data);
  }

  /**
   * Wrapper for DELETE requests.
   * @param {string} endpoint - API endpoint.
   * @returns {Promise<any>} - The response data.
   */
  delete(endpoint) {
    return this.request("delete", endpoint);
  }

  /**
   * Logout the user, clear tokens, and redirect to login.
   */
  async logout() {
    try {
      await this.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      this.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
