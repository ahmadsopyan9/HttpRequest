/**
 * HttpRequest - HTTP Client dengan fitur lengkap
 * 
 * @class HttpRequest
 * @author Ahmad Sofyan
 * @version 2.0.0
 * @repo https://github.com/ahmadsopyan9/HttpRequest 
 *
 * @example
 * const http = new HttpRequest('https://api.example.com');
 * 
 * // GET request
 * const data = await http.get('/users', { page: 1 });
 * 
 * // POST request
 * const result = await http.post('/users', { name: 'John' });
 * 
 * // With timeout & retry
 * const result = await http.post('/users', { name: 'John' }, {
 *   timeout: 5000,
 *   retries: 3
 * });
 */
class HttpRequest {
  /**
   * Create a new HttpRequest instance
   * @param {string} baseURL - Base URL for all requests
   * @param {Object} headers - Default headers for all requests
   */
  constructor(baseURL = '', headers = {}) {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.cache = new Map();
    this.defaultTimeout = 30000;
    this.defaultRetries = 0;
  }

  /**
   * Clean headers from null/undefined values
   * @param {Object} headers - Headers to clean
   * @returns {Object} Cleaned headers
   * @private
   */
  _cleanHeaders(headers) {
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([_, value]) => value != null)
    );
  }

  /**
   * Build full URL
   * @param {string} url - Request URL
   * @returns {string} Full URL
   * @private
   */
  _buildURL(url) {
    if (!this.baseURL) return url;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    const base = this.baseURL;
    const path = url.startsWith('/') ? url : '/' + url;
    return base + path;
  }

  /**
   * Add request interceptor
   * @param {Function} fn - Interceptor function
   */
  addRequestInterceptor(fn) {
    this.requestInterceptors.push(fn);
    return this;
  }

  /**
   * Add response interceptor
   * @param {Function} fn - Interceptor function
   */
  addResponseInterceptor(fn) {
    this.responseInterceptors.push(fn);
    return this;
  }

  /**
   * Execute HTTP request
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {*} data - Request data
   * @param {Object} options - Request options
   * @param {number} options.timeout - Request timeout in ms
   * @param {number} options.retries - Number of retry attempts
   * @param {number} options.retryDelay - Delay between retries in ms
   * @param {boolean} options.cache - Enable cache for GET requests
   * @param {number} options.cacheTTL - Cache TTL in ms
   * @param {AbortSignal} options.signal - Abort signal
   * @param {Object} options.headers - Custom headers
   * @returns {Promise<*>} Response data
   */
  async request(method, url, data = null, options = {}) {
    // Run request interceptors
    let context = { method, url, data, options };
    for (const interceptor of this.requestInterceptors) {
      const result = interceptor(context);
      if (result) context = result;
    }

    // Check cache for GET
    const cacheKey = `${method}:${url}?${JSON.stringify(data)}`;
    if (method === 'GET' && options.cache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        const now = Date.now();
        const ttl = options.cacheTTL || 60000;
        if (now - cached.timestamp < ttl) {
          return cached.data;
        }
      }
    }

    const maxRetries = options.retries || this.defaultRetries;
    const retryDelay = options.retryDelay || 1000;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this._executeRequest(method, url, data, options);
        
        // Cache result for GET
        if (method === 'GET' && options.cache) {
          this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
        }
        
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  /**
   * Execute single request attempt
   * @private
   */
  async _executeRequest(method, url, data = null, options = {}) {
    // Build URL
    let endpoint = this._buildURL(url);
    const timeout = options.timeout || this.defaultTimeout;

    // Clean headers
    const headers = {
      ...this._cleanHeaders(this.headers),
      ...this._cleanHeaders(options.headers || {}),
    };

    // Handle GET query params
    if (method === 'GET' && data) {
      const urlObj = new URL(endpoint);
      const params = new URLSearchParams(urlObj.search);
      
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          params.set(key, value);
        }
      }
      
      endpoint = `${urlObj.origin}${urlObj.pathname}?${params}`;
      data = null;
    }

    // Prepare body
    let body = data;
    if (data && headers['Content-Type']) {
      if (headers['Content-Type'].includes('application/json')) {
        body = JSON.stringify(data);
      } else if (headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
        body = new URLSearchParams(data).toString();
      }
    }

    // Setup AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Execute fetch
      const response = await fetch(endpoint, {
        method,
        headers,
        body,
        signal: options.signal || controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      // Handle error response
      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get('content-type') || '';
          errorData = contentType.includes('application/json')
            ? await response.json()
            : await response.text();
        } catch {
          errorData = 'Failed to parse error response';
        }

        const error = new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = errorData;
        error.url = endpoint;
        error.method = method;
        throw error;
      }

      // Parse response
      const contentType = response.headers.get('content-type') || '';
      let responseData = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      // Run response interceptors
      for (const interceptor of this.responseInterceptors) {
        const result = interceptor(responseData);
        if (result) responseData = result;
      }

      return responseData;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} params - Query parameters
   * @param {Object} options - Request options
   * @returns {Promise<*>}
   */
  get(url, params = {}, options = {}) {
    return this.request('GET', url, params, options);
  }

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {*} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<*>}
   */
  post(url, data = null, options = {}) {
    return this.request('POST', url, data, options);
  }

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {*} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<*>}
   */
  put(url, data = null, options = {}) {
    return this.request('PUT', url, data, options);
  }

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<*>}
   */
  delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }

  /**
   * Upload file with progress
   * @param {string} url - Upload URL
   * @param {File} file - File to upload
   * @param {Function} onProgress - Progress callback
   * @param {Object} options - Request options
   * @returns {Promise<*>}
   */
  upload(url, file, onProgress = null, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fullUrl = this._buildURL(url);
      
      xhr.open('POST', fullUrl, true);

      // Set headers (except Content-Type for FormData)
      for (const [key, value] of Object.entries(this.headers)) {
        if (key.toLowerCase() !== 'content-type') {
          xhr.setRequestHeader(key, value);
        }
      }

      // Progress tracking
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent, event);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  }

  /**
   * Clear cache
   * @param {string} key - Specific cache key to clear
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
    return this;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HttpRequest;
}
