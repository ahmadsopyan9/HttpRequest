# HttpRequest

## Class ini dirancang untuk:

    Memudahkan manajemen API endpoint

    Menyediakan interface yang konsisten untuk berbagai jenis request

    Menangani kasus-kasus umum secara otomatis

    Menyediakan error handling yang lebih informatif

    Mendukung berbagai tipe data request dan response


## Fitur utama yang termasuk dalam class ini:
    Base URL: Memungkinkan konfigurasi URL dasar untuk semua request

    Header Default: Header default yang bisa dikustomisasi

    Method HTTP: Mendukung GET, POST, PUT, DELETE

    Parameter Query: Otomatis menangani parameter query untuk GET

    Body Request: Otomatis memproses body untuk JSON dan form-urlencoded

    Error Handling: Menangani error response dengan parsing otomatis

    Response Parsing: Otomatis memparse response berdasarkan Content-Type

    Validasi URL: Menangani konstruksi URL dengan benar
    

# Cara penggunaan:

### 1. Instansiasi:
```
const api = new HttpRequest('https://api.example.com', {
  'Authorization': 'Bearer token123'
});
```
### 2. GET Request:
```
api.get('/endpoint', { param1: 'value1' })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. POST Request:
```
api.post('/endpoint', { key: 'value' })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 4. Custom Header:
```
api.post('/endpoint', data, {
  headers: {
    'Custom-Header': 'value'
  }
});
```

### 5. Form Data:
```
const formData = new FormData();
formData.append('file', fileInput.files[0]);

api.post('/upload', formData, {
  headers: { 'Content-Type': undefined }
});
```

