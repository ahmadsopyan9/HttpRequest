# HttpRequest

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**HttpRequest** adalah HTTP client JavaScript yang ringan dan powerful untuk memudahkan komunikasi dengan API. Dibangun di atas `fetch` API dengan berbagai fitur tambahan seperti interceptor, cache, retry logic, timeout, dan upload progress.

---

## 📋 Daftar Isi

- [Deskripsi](#-deskripsi)
- [Fitur](#-fitur)
- [Persyaratan](#-persyaratan)
- [Instalasi](#-instalasi)
- [Cara Penggunaan](#-cara-penggunaan)
  - [1. Instansiasi](#1-instansiasi)
  - [2. GET Request](#2-get-request)
  - [3. POST Request](#3-post-request)
  - [4. PUT Request](#4-put-request)
  - [5. DELETE Request](#5-delete-request)
  - [6. Custom Headers](#6-custom-headers)
  - [7. Form Data & Upload File](#7-form-data--upload-file)
  - [8. Query Parameters](#8-query-parameters)
  - [9. Timeout & Retry](#9-timeout--retry)
  - [10. Cache](#10-cache)
  - [11. Interceptors](#11-interceptors)
  - [12. Upload Progress](#12-upload-progress)
  - [13. Abort Request](#13-abort-request)
  - [14. Error Handling](#14-error-handling)
- [API Reference](#-api-reference)
- [Contoh Integrasi](#-contoh-integrasi)
- [Troubleshooting](#-troubleshooting)
- [Lisensi](#-lisensi)

---

## 📝 Deskripsi

Class ini dirancang untuk:

- Memudahkan manajemen API endpoint
- Menyediakan interface yang konsisten untuk berbagai jenis request
- Menangani kasus-kasus umum secara otomatis
- Menyediakan error handling yang lebih informatif
- Mendukung berbagai tipe data request dan response
- Meningkatkan produktivitas dengan fitur-fitur canggih

Dibangun di atas `fetch` API native dengan tambahan fitur yang biasanya hanya ada di library besar seperti Axios.

---

## ✨ Fitur

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Base URL | ✅ | Konfigurasi URL dasar untuk semua request |
| Default Headers | ✅ | Header default yang bisa dikustomisasi |
| HTTP Methods | ✅ | Mendukung GET, POST, PUT, DELETE |
| Query Parameters | ✅ | Otomatis menangani parameter query untuk GET |
| Body Request | ✅ | Otomatis memproses body untuk JSON dan form-urlencoded |
| Error Handling | ✅ | Menangani error response dengan parsing otomatis |
| Response Parsing | ✅ | Otomatis memparse response berdasarkan Content-Type |
| URL Validasi | ✅ | Menangani konstruksi URL dengan benar |
| Timeout | ✅ | Timeout otomatis untuk setiap request |
| Retry Logic | ✅ | Retry otomatis saat gagal |
| Cache | ✅ | Cache untuk GET request |
| Interceptors | ✅ | Request & Response interceptors |
| Upload Progress | ✅ | Tracking progress upload file |
| Abort Controller | ✅ | Cancel request dengan AbortController |
| Universal | ✅ | Support browser & Node.js |

---

## 🖥️ Persyaratan

- **Browser**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Node.js**: v16.0.0+ (dengan `fetch` atau `node-fetch`)
- **JavaScript**: ES6+ (Promise, async/await)

---

## 📦 Instalasi

### 1. Download File

Salin `HttpRequest.js` ke direktori project Anda.

### 2. Include di HTML (Browser)

```html
<script src="HttpRequest.js"></script>
<script>
  const http = new HttpRequest('https://api.example.com');
</script>
```

### 3. Import ES Module

```javascript
import HttpRequest from './HttpRequest.js';

const http = new HttpRequest('https://api.example.com');
```

### 4. CommonJS (Node.js)

```javascript
const HttpRequest = require('./HttpRequest.js');

const http = new HttpRequest('https://api.example.com');
```

---

## 🚀 Cara Penggunaan

### 1. Instansiasi

```javascript
// Basic - tanpa base URL
const http = new HttpRequest();

// Dengan base URL
const api = new HttpRequest('https://api.example.com');

// Dengan default headers
const api = new HttpRequest('https://api.example.com', {
  'Authorization': 'Bearer token123',
  'X-API-Key': 'your-api-key',
  'Accept': 'application/json'
});
```

### 2. GET Request

```javascript
// GET dengan parameter query
api.get('/users', { page: 1, limit: 10 })
  .then(data => console.log(data))
  .catch(error => console.error(error));

// GET tanpa parameter
api.get('/users/1')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/Await
try {
  const users = await api.get('/users', { page: 1 });
  console.log(users);
} catch (error) {
  console.error(error);
}
```

### 3. POST Request

```javascript
// POST dengan JSON
api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
})
.then(data => console.log(data))
.catch(error => console.error(error));

// POST dengan async/await
try {
  const result = await api.post('/users', {
    name: 'Jane Doe',
    email: 'jane@example.com'
  });
  console.log(result);
} catch (error) {
  console.error(error);
}
```

### 4. PUT Request

```javascript
// Update data
api.put('/users/1', {
  name: 'John Updated',
  email: 'john.updated@example.com'
})
.then(data => console.log(data))
.catch(error => console.error(error));
```

### 5. DELETE Request

```javascript
// Delete data
api.delete('/users/1')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// DELETE dengan parameter (jarang, tapi bisa)
api.delete('/users', { data: { id: 1 } })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 6. Custom Headers

```javascript
// Per-request headers
api.post('/upload', data, {
  headers: {
    'Custom-Header': 'custom-value',
    'X-Request-ID': '12345'
  }
});

// Header untuk semua request (di constructor)
const api = new HttpRequest('https://api.example.com', {
  'Authorization': 'Bearer token123',
  'X-Client-Version': '1.0.0'
});

// Override header untuk request tertentu
api.get('/users', null, {
  headers: {
    'Authorization': 'Bearer new-token-here' // Override
  }
});
```

### 7. Form Data & Upload File

```javascript
// FormData untuk upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', 'profile.jpg');
formData.append('description', 'User profile photo');

api.post('/upload', formData, {
  headers: {
    'Content-Type': undefined // Biarkan browser set boundary
  }
})
.then(data => console.log(data))
.catch(error => console.error(error));

// Upload dengan progress tracking (method khusus)
const file = document.querySelector('input[type="file"]').files[0];

api.upload('/upload', file, (percent, event) => {
  console.log(`Upload progress: ${percent}%`);
  document.querySelector('.progress-bar').style.width = `${percent}%`;
})
.then(data => console.log('Upload success:', data))
.catch(error => console.error('Upload failed:', error));
```

### 8. Query Parameters

```javascript
// Parameter query otomatis diubah menjadi URLSearchParams
api.get('/products', {
  category: 'electronics',
  minPrice: 100,
  maxPrice: 1000,
  sort: 'price_asc',
  page: 1,
  limit: 20
});

// Hasil URL:
// https://api.example.com/products?category=electronics&minPrice=100&maxPrice=1000&sort=price_asc&page=1&limit=20

// Parameter null/undefined akan diabaikan
api.get('/products', {
  category: 'electronics',
  brand: null, // Diabaikan
  color: undefined // Diabaikan
});
```

### 9. Timeout & Retry

```javascript
// Timeout 5 detik
api.get('/slow-endpoint', null, {
  timeout: 5000 // 5 seconds
})
.then(data => console.log(data))
.catch(error => console.error(error));

// Retry 3 kali dengan delay 1 detik
api.post('/unstable-endpoint', data, {
  retries: 3,
  retryDelay: 1000 // 1 second
})
.then(data => console.log(data))
.catch(error => console.error(error));

// Kombinasi timeout dan retry
api.get('/unstable-endpoint', null, {
  timeout: 3000,
  retries: 3,
  retryDelay: 500
});
```

### 10. Cache

```javascript
// Cache GET request (default TTL 60 detik)
api.get('/products', { category: 'electronics' }, {
  cache: true,
  cacheTTL: 30000 // 30 detik
})
.then(data => console.log(data));

// Clear cache
api.clearCache(); // Hapus semua cache
api.clearCache('GET:/products?category=electronics'); // Hapus spesifik
```

### 11. Interceptors

```javascript
// Request interceptor - modify request sebelum dikirim
api.addRequestInterceptor((context) => {
  // Tambahkan timestamp ke setiap request
  context.options.headers = {
    ...context.options.headers,
    'X-Request-Time': Date.now()
  };
  return context;
});

// Response interceptor - modify response setelah diterima
api.addResponseInterceptor((data) => {
  // Standardize response format
  return {
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  };
});

// Contoh logging interceptor
api.addRequestInterceptor((context) => {
  console.log(`[${context.method}] ${context.url}`, context.data);
  return context;
});

api.addResponseInterceptor((data) => {
  console.log('Response:', data);
  return data;
});
```

### 12. Upload Progress

```javascript
// Upload file dengan progress bar
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');

api.upload('/upload', fileInput.files[0], (percent, event) => {
  progressBar.style.width = `${percent}%`;
  progressBar.textContent = `${percent}%`;
  
  if (percent === 100) {
    console.log('Upload complete!');
  }
})
.then(data => {
  console.log('Upload success:', data);
  alert('File uploaded successfully!');
})
.catch(error => {
  console.error('Upload failed:', error);
  alert('Upload failed!');
});
```

### 13. Abort Request

```javascript
// Buat AbortController
const controller = new AbortController();

// Kirim request dengan signal
api.get('/long-request', null, {
  signal: controller.signal
})
.then(data => console.log(data))
.catch(error => {
  if (error.name === 'AbortError') {
    console.log('Request cancelled by user');
  } else {
    console.error(error);
  }
});

// Batalkan request
controller.abort();
```

### 14. Error Handling

```javascript
// Try-catch dengan detail error
try {
  const data = await api.get('/users/999');
  console.log(data);
} catch (error) {
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Data:', error.data);
  console.error('URL:', error.url);
  console.error('Method:', error.method);
  
  if (error.status === 404) {
    console.log('User not found');
  } else if (error.status === 401) {
    console.log('Unauthorized - redirect to login');
  } else if (error.status === 500) {
    console.log('Server error - try again later');
  }
}

// Promise style
api.get('/users/999')
  .then(data => console.log(data))
  .catch(error => {
    if (error.status === 404) {
      console.log('Not found');
    } else {
      console.error('Error:', error.message);
    }
  });
```

---

## 📚 API Reference

### Class: `HttpRequest`

#### Constructor
```javascript
new HttpRequest(string baseURL = '', Object headers = {})
```

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `baseURL` | string | `''` | Base URL untuk semua request |
| `headers` | Object | `{}` | Default headers untuk semua request |

#### Methods

| Method | Parameter | Return | Deskripsi |
|--------|-----------|--------|-----------|
| `get()` | `url, params = {}, options = {}` | `Promise` | GET request |
| `post()` | `url, data = null, options = {}` | `Promise` | POST request |
| `put()` | `url, data = null, options = {}` | `Promise` | PUT request |
| `delete()` | `url, options = {}` | `Promise` | DELETE request |
| `upload()` | `url, file, onProgress = null, options = {}` | `Promise` | Upload file dengan progress |
| `request()` | `method, url, data = null, options = {}` | `Promise` | Generic request |
| `addRequestInterceptor()` | `fn` | `this` | Tambah request interceptor |
| `addResponseInterceptor()` | `fn` | `this` | Tambah response interceptor |
| `clearCache()` | `key = null` | `this` | Clear cache (spesifik atau semua) |

#### Options

| Opsi | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `headers` | Object | `{}` | Custom headers untuk request |
| `timeout` | number | `30000` | Timeout dalam milidetik |
| `retries` | number | `0` | Jumlah retry jika gagal |
| `retryDelay` | number | `1000` | Delay antar retry (ms) |
| `cache` | boolean | `false` | Enable cache untuk GET |
| `cacheTTL` | number | `60000` | Cache TTL dalam milidetik |
| `signal` | AbortSignal | `null` | Abort signal untuk cancel |

---

## 💻 Contoh Integrasi

### React.js

```javascript
// api.js
import HttpRequest from './HttpRequest';

const api = new HttpRequest(process.env.REACT_APP_API_URL, {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'X-Client': 'React App'
});

// Request interceptor - refresh token
api.addRequestInterceptor((context) => {
  const token = localStorage.getItem('token');
  if (token) {
    context.options.headers = {
      ...context.options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return context;
});

// Response interceptor - handle 401
api.addResponseInterceptor((data) => {
  // Standard response format
  return data;
});

export default api;
```

```javascript
// Users.jsx
import React, { useState, useEffect } from 'react';
import api from './api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.get('/users', { page: 1, limit: 10 });
      setUsers(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const result = await api.post('/users', userData);
      await fetchUsers(); // Refresh list
      return result;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
```

### Vue.js

```javascript
// api.js
import HttpRequest from './HttpRequest';

const api = new HttpRequest(import.meta.env.VITE_API_URL, {
  'X-Client': 'Vue App'
});

// Interceptor untuk auth
api.addRequestInterceptor((context) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    context.options.headers = {
      ...context.options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return context;
});

export default api;
```

```vue
<!-- Users.vue -->
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './api';

const users = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  
  try {
    users.value = await api.get('/users', { page: 1 });
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
```

### Node.js / Express

```javascript
// app.js
const HttpRequest = require('./HttpRequest');

const api = new HttpRequest('https://jsonplaceholder.typicode.com', {
  'User-Agent': 'Node.js App'
});

// GET request
async function getPosts() {
  try {
    const posts = await api.get('/posts', { userId: 1 });
    console.log('Posts:', posts.length);
    return posts;
  } catch (error) {
    console.error('Error:', error.status, error.message);
    throw error;
  }
}

// POST request
async function createPost(data) {
  try {
    const result = await api.post('/posts', data);
    console.log('Created post ID:', result.id);
    return result;
  } catch (error) {
    console.error('Create error:', error.data);
    throw error;
  }
}

// Run
getPosts().then(posts => {
  console.log('First post:', posts[0]?.title);
});

createPost({
  title: 'My New Post',
  body: 'This is the content...',
  userId: 1
});
```

---

## 🔧 Troubleshooting

### 1. Error: fetch is not defined (Node.js)

**Solusi:** Install dan import node-fetch:
```bash
npm install node-fetch
```

```javascript
// Di awal file
const fetch = require('node-fetch');
// Atau untuk ES Module
import fetch from 'node-fetch';
```

### 2. Error: CORS (Cross-Origin)

**Solusi:** Pastikan server mengirim header CORS yang sesuai:
```javascript
// Atau gunakan mode cors di fetch
api.get('/endpoint', null, {
  mode: 'cors',
  credentials: 'include'
});
```

### 3. Error: Timeout

**Solusi:** Tingkatkan timeout:
```javascript
api.get('/slow-endpoint', null, {
  timeout: 60000 // 60 detik
});
```

### 4. Upload tidak berhasil

**Solusi:** Pastikan Content-Type tidak diset untuk FormData:
```javascript
api.upload('/upload', file, null, {
  headers: {
    'Content-Type': undefined // Penting!
  }
});
```

### 5. Cache tidak bekerja

**Solusi:** Periksa apakah:
- Method adalah `GET`
- `cache: true` diset
- Belum expired (periksa `cacheTTL`)

---

## 📄 Lisensi

**MIT License** - Silahkan digunakan dan dimodifikasi sesuai kebutuhan.

---

## 🔄 Changelog

### v2.0.0 (2024)
- ✅ Penambahan timeout & retry logic
- ✅ Penambahan cache system
- ✅ Penambahan interceptors
- ✅ Penambahan upload progress
- ✅ Penambahan AbortController support
- ✅ Perbaikan URL handling
- ✅ Perbaikan query params duplicate

### v1.0.0 (2024)
- ✅ Initial release
- ✅ Basic HTTP methods
- ✅ Headers management
- ✅ Query params
- ✅ Error handling

---

**⭐ Jika Anda menyukai library ini, berikan star di repository!**
