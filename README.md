# HttpRequest

## Class ini dirancang untuk:
Memudahkan manajemen API endpoint
Menyediakan interface yang konsisten untuk berbagai jenis request
Menangani kasus-kasus umum secara otomatis
Menyediakan error handling yang lebih informatif
Mendukung berbagai tipe data request dan response


## Fitur utama yang termasuk dalam class ini:
1. Base URL: Memungkinkan konfigurasi URL dasar untuk semua request
2. Header Default: Header default yang bisa dikustomisasi
3. Method HTTP: Mendukung GET, POST, PUT, DELETE
4. Parameter Query: Otomatis menangani parameter query untuk GET
5. Body Request: Otomatis memproses body untuk JSON dan form-urlencoded
6. Error Handling: Menangani error response dengan parsing otomatis
7. Response Parsing: Otomatis memparse response berdasarkan Content-Type
8. Validasi URL: Menangani konstruksi URL dengan benar



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

