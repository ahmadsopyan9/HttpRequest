# HttpRequest

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

1. Instansiasi:
```
const api = new HttpRequest('https://api.example.com', {
  'Authorization': 'Bearer token123'
});
```
