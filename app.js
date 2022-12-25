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

app.post("/save-peminjaman", function(req, res){
  let {
    id_anggota,
    id_buku,
    tanggal_pinjam,
    tanggal_kembali
  } = req.body;

  var statusp = 'aktif';
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query(`INSERT INTO peminjaman (id_anggota, id_buku, tanggal_peminjaman, tanggal_pengembalian, status_peminjaman) VALUES (${id_anggota}, ${id_buku}, '${tanggal_pinjam}', '${tanggal_kembali}', 'aktif')`, function (err){
      if (err) console.log(err);
      res.redirect('/peminjaman');
    })
  })

});



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

app.get('/create-buku',(req,res)=>{
  sql.connect(config,function(){
    async.parallel([], 
      function(error,callbackResults){
      if(error){
        console.log(error);
      }else{
        res.render('buku/create-buku.ejs',{
        });
      }
    });
  })
});

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

app.get('/edit-buku/:id',(req,res)=>{
  let id = req.params.id;
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query('select buku.id, buku.judul_buku, buku.pengarang, buku.jumlah_halaman, buku.sinopsis from buku where id= '+id+'', function (err, dataBuku){
      res.render('buku/edit-buku.ejs',{
        listBuku: dataBuku.recordset,
      });
    })
  })
});

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


app.get('/anggota', (req,res) => {
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query('select * from anggota', function (err, dataAnggota){
      // console.log(dataAnggota.recordset);
      res.render('anggota/index-anggota.ejs',{
        listAnggota: dataAnggota.recordset,
      });
    })
  })
});

app.post("/save-anggota", function(req, res){
  let {
    nama_lengkap,
    alamat,
    no_hp
  } = req.body;

  sql.connect(config,function(){
    var request = new sql.Request();
    request.query(`INSERT INTO anggota (nama_lengkap, alamat, no_hp) VALUES ('${nama_lengkap}', '${alamat}', '${no_hp}')`, function (err){
      if (err) console.log(err);
      res.redirect('/anggota');
    })
  })
});

app.get('/edit-anggota/:id', (req,res)=>{
  let id = req.params.id;
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query('select * from anggota where id= '+id+'', function (err, dataAnggota){
      res.render('anggota/update-anggota.ejs',{
        listAnggota: dataAnggota.recordset,
      });
    })
  })
});

app.post("/update-anggota/", function(req, res){
  let {
    id,
    nama_lengkap,
    alamat,
    no_hp
  } = req.body;

  sql.connect(config,function(){
    var request = new sql.Request();
    request.query("UPDATE anggota SET nama_lengkap = '"+nama_lengkap+"', alamat = '"+alamat+"', no_hp = '"+no_hp+"' WHERE id="+id+";", function (err, dataBuku){
      res.redirect('/anggota');
    })
  })
});

app.get('/delete-anggota/:id', (req,res)=>{
  let id = req.params.id;
  console.log(id);
  sql.connect(config,function(){
    var request = new sql.Request();
    request.query("DELETE FROM anggota WHERE id="+id+"", function (err, dataAnggota){
      res.redirect('/anggota');
    })
  })
});

app.get('/create-anggota',(req,res)=>{
  res.render('anggota/create-anggota.ejs');
});

app.listen(5000, function ()  {
    console.log('Server is running..');
});

    // sql.connect(config, function (err) {
    //     if (err) console.log(err);
    //     var request = new sql.Request();
    //     request.query('select * from barang', function (err, recordset) {
    //         if (err) console.log(err)
    //         res.send(recordset);
    //     });
    // });
