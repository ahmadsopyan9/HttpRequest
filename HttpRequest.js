class HttpRequest {
  constructor(baseURL = '', headers = {}) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  async request(method, url, data = null, options = {}) {
    // Membersihkan header dari nilai null/undefined
    const cleanHeaders = (headers) => {
      const cleaned = {};
      for (const key in headers) {
        if (headers[key] != null) cleaned[key] = headers[key];
      }
      return cleaned;
    };

    // Menggabungkan header
    const headers = {
      ...cleanHeaders(this.headers),
      ...cleanHeaders(options.headers || {}),
    };

    // Membuat URL akhir
    let endpoint;
    try {
      endpoint = this.baseURL 
        ? new URL(url, this.baseURL).href
        : url;
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }

    // Menangani parameter query untuk GET
    if (method === 'GET' && data) {
      const params = new URLSearchParams(data).toString();
      endpoint += `?${params}`;
      data = null;
    }

    // Menyiapkan body request
    let body = data;
    if (data && headers['Content-Type']) {
      if (headers['Content-Type'].includes('application/json')) {
        body = JSON.stringify(data);
      } else if (headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
        body = new URLSearchParams(data).toString();
      }
    }

    // Eksekusi fetch request
    const response = await fetch(endpoint, {
      method,
      headers,
      body,
      ...options,
    });

    // Handle error response
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        try {
          errorData = await response.text();
        } catch {
          errorData = 'Failed to parse error response';
        }
      }
      const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Parsing response
    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') 
      ? response.json() 
      : response.text();
  }

  get(url, params = {}, options = {}) {
    return this.request('GET', url, params, options);
  }

  post(url, data = null, options = {}) {
    return this.request('POST', url, data, options);
  }

  put(url, data = null, options = {}) {
    return this.request('PUT', url, data, options);
  }

  delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }
}
