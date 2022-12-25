# Microsoft SQL Server CRUD
Kelompok 6 Manajemen Basis Data A
1. Adi Pratama Putra (1207050140)
2. Aditya Muhamad Maulana (1207050002)
3. Anne Rayana Jasmin (1207050014)

# Aplikasi Perpustakaan 
**Client**: ExpressJS <br>
**Server**: NodeJS, Docker Microsoft SQL Server <br>

# Download Project
Command dalam terminal
```
git clone https://github.com/AppAdi/Node-Mssql-Kelompok-6-IF-A.git
npm start
```

# Instalasi Microsoft SQL Server via Docker
-- Pull Images <br>
`docker pull mcr.microsoft.com/mssql/server`<br><br>
-- List Images <br>
`docker image ls` <br><br>
-- Create Container <br>
`docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=b@s1sDATA" -p 1433:1433 --name mssqldb --hostname mssqldb -d mcr.microsoft.com/mssql/server:2022-latest`<br><br>
-- List Container<br>
`docker ps`

# Konektivitas ke Database
-- Connect <br>
`docker exec -it mssqldb "bash"`<br><br>
-- SQLCMD <br>
`/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "b@s1sDATA"<br>`

# Endpoint
Contoh penerapan endpoint pada aplikasi
## Konektivitas
```
const express = require('express');
const app = express();
const sql = require("mssql");
const async = require('async');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = {
  user: 'sa',
  password: 'b@s1sDATA',
  server: 'localhost', 
  database: 'perpustakaan',
  trustServerCertificate: true
};
```

## Create
```
app.get('/create-peminjaman',(req,res)=>{
  sql.connect(config,function(){
    async.parallel([
      function(callback){
        var request = new sql.Request();
        request.query('select id,nama_lengkap from anggota', function (err, dataAnggota) {
            if (err) {return callback(err);}
            return callback(null, dataAnggota);
        });
      },function(callback){
        var request = new sql.Request();
        request.query('select id,judul_buku from buku', function (err, dataBuku) {
            if (err) {return callback(err);}
            return callback(null, dataBuku);
        });
      }
    ], function(error,callbackResults){
      if(error){
        console.log(error);
      }else{
        res.render('peminjaman/create-peminjaman.ejs',{
          listAnggota:callbackResults[0].recordset,
          listBuku:callbackResults[1].recordset,
        });
      }
    });
  })
});
```

### Read
```
app.get('/peminjaman', (req,res) => {
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query('select peminjaman.id, anggota.nama_lengkap, buku.judul_buku, peminjaman.tanggal_peminjaman, peminjaman.tanggal_pengembalian, peminjaman.status_peminjaman from peminjaman inner join anggota on peminjaman.id_anggota = anggota.id inner join buku on peminjaman.id_buku = buku.id', function (err, dataPeminjaman){
      res.render('peminjaman/index-peminjaman.ejs',{
        listPeminjaman: dataPeminjaman.recordset,
      });
    })
  })
});
```

## Update
```
app.get('/update-peminjaman/:id', (req,res)=>{
  let id = req.params.id;
  console.log(id);
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query("UPDATE peminjaman set status_peminjaman = 'selesai' WHERE id="+id+"", function (err, dataPeminjaman){
      res.redirect('/peminjaman');
    })
  })
});
```

## Delete
```
app.get('/delete-peminjaman/:id', (req,res)=>{
  let id = req.params.id;
  console.log(id);
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query("DELETE FROM peminjaman WHERE id="+id+"", function (err, dataPeminjaman){
      res.redirect('/peminjaman');
    })
  })
});
```

# Screenshot Aplikasi
### Halaman Daftar Buku (Read)
![1](https://user-images.githubusercontent.com/83355111/209463430-3c80f73d-04db-4dce-ade7-a3b5bda04505.png)
### Halaman Tambah Buku (Create)
![2](https://user-images.githubusercontent.com/83355111/209463429-6dec7cca-e688-48d3-ad31-b3e37be3673a.png)
### Halaman Edit Buku (Update)
![3](https://user-images.githubusercontent.com/83355111/209463434-122fb393-e6c2-42fa-902f-fc848e49b95b.png)
### Halaman Daftar Buku Setelah Menghapus Buku (Delete)
![4](https://user-images.githubusercontent.com/83355111/209463435-bf5040c0-7a4f-4978-b117-c9909ae74441.png)
