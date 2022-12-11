var express = require('express');
var app = express();

app.get('/', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'b@s1sDATA',
        server: 'localhost', 
        database: 'market',
        trustServerCertificate: true
    };

    var config = sql.connect({
        user: 'sa',
        password: 'b@s1sDATA',
        server: 'localhost', 
        database: 'market',
        trustServerCertificate: true
    });
    
    var conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pos"
    });

    app.get('/peminjaman', (req,res) => {
        var request = new sql.Request();
        request.query('select anggota.nama_anggota, buku.nama_buku, peminjaman.tanggal_peminjaman, peminjaman.tanggal_pengembalian, peminjaman.status_peminjaman from peminjaman inner join anggota on peminjaman.id_anggota = anggota.id inner join buku on peminjaman.id_buku = buku.id', function (err, dataPeminjaman) {
            if(err) throw err;
            res.render('kasir/home-kasir.ejs',{
                listPeminjaman: dataPeminjaman,
            });
        });
    });

    app.get('/peminjaman-data',(req,res)=>{
        async.parallel([
          function(callback){
            var request = new sql.Request();
            request.query('select id,nama_anggota from anggota', function (err, dataAnggota) {
                if (err) {return callback(err);}
                return callback(null, dataAnggota);
            });
          },function(callback){
            var request = new sql.Request();
            request.query('select id,nama_buku from anggota', function (err, dataBuku) {
                if (err) {return callback(err);}
                return callback(null, dataBuku);
            });
          }
        ], function(error,callbackResults){
          if(error){
            console.log(error);
          }else{
            res.render('manager/home-manager.ejs',{
              listAnggota:callbackResults[0],
              listBuku:callbackResults[1],
            });
          }
        });
      });

    app.post("/save-peminjaman", function(request, response, next){
        var ida = request.body.id_anggota;
        var idb = request.body.id_buku;
        var tanggal_pinjam = request.body.tanggal_peminjaman;
        var tanggal_kembali = request.body.tanggal_kembali;
        var statusp = "aktif";
    
        var request = new sql.Request();
        var query = `INSERT INTO peminjaman (id_anggota, id_buku, tanggal_peminjaman, tanggal_pengembalian, status) VALUES ("${ida}", "${idb}", "${tanggal_pinjam.toLocaleString().split(",")[0]}", "${tanggal_kembali.toLocaleString().split(",")[0]}", "${statusp}")`;
        request.query(query, function(error, data){
            console.log("Sukses Transaksi");
        });

        response.redirect('/peminjaman');
    });

    app.post('/delete-peminjaman/', (req,res)=>{
        let id = req.body.id;
        console.log(id);
        var request = new sql.Request();
        var query = "DELETE FROM peminjaman WHERE id="+id+"";
        request.query(query,(err, results) => {
            console.log("Sukses Transaksi");
        });
      });
      
    app.post('/update-peminjman/', (req,res)=>{
        let id = req.body.id;
        console.log(id);
        var request = new sql.Request();
        var query = "UPDATE peminjaman set status_peminjaman = 'selesai' WHERE id="+id+"";
        request.query(query,(err, results) => {
            console.log("Sukses Transaksi");
            response.redirect('/peminjaman');
        });
    });

    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from barang', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset);
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});