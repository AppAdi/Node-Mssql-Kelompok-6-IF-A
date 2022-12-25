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
`/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "b@s1sDATA"`

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
app.post("/save-buku", function(req, res){
  let {
    judul_buku,
    pengarang,
    jumlah_halaman,
    sinopsis,
  } = req.body;

  sql.connect(config,function(){
    var request = new sql.Request();
    request.query(`INSERT INTO buku (judul_buku, pengarang, jumlah_halaman, sinopsis) VALUES ('${judul_buku}', '${pengarang}', '${jumlah_halaman}', '${sinopsis}')`, function (err){
      if (err) console.log(err);
      res.redirect('/buku');
    })
  })
});
```

### Read
```
app.get('/buku', (req,res) => {
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query('select buku.id, buku.judul_buku, buku.pengarang, buku.jumlah_halaman, buku.sinopsis from buku', function (err, dataBuku){
      res.render('buku/index-buku.ejs',{
        listBuku: dataBuku.recordset,
      });
    })
  })
});
```

## Update
```
app.post("/update-buku/", function(req, res){
  let {
    id,
    judul_buku,
    pengarang,
    jumlah_halaman,
    sinopsis
  } = req.body;

  sql.connect(config,function(){
    var request = new sql.Request();
    request.query("UPDATE buku SET judul_buku = '"+judul_buku+"', pengarang = '"+pengarang+"', jumlah_halaman = '"+jumlah_halaman+"', sinopsis = '"+sinopsis+"' WHERE id="+id+";", function (err, dataBuku){
      res.redirect('/buku');
    })
  })
});
```

## Delete
```
app.get('/delete-buku/:id', (req,res)=>{
  let id = req.params.id;
  console.log(id);
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query("DELETE FROM buku WHERE id="+id+"", function (err, dataBuku){
      res.redirect('/buku');
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
