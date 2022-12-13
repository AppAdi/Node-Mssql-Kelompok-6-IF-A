-- Pull Images
docker pull mcr.microsoft.com/mssql/server

-- List Images
docker image ls

-- Create Container
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=b@s1sDATA" -p 1433:1433 --name mssqldb --hostname mssqldb -d mcr.microsoft.com/mssql/server:2022-latest

-- List Container
docker ps

-- Connect
docker exec -it mssqldb "bash"

-- SQLCMD
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "b@s1sDATA"

-- Create DB
create database perpustakaan
select name from sys.databases
go

-- Pakai DB + Create Table + Insert + Select
use perpustakaan
create table buku (id INT IDENTITY(1,1) PRIMARY KEY, judul_buku NVARCHAR(100), pengarang NVARCHAR(100), jumlah_halaman INT, sinopsis TEXT)
insert into buku (judul_buku, pengarang, jumlah_halaman, sinopsis) values ('Laut Bercerita', 'Leila S. Chudori', 315, 'Bertutur tentang kisah keluarga yang kehilangan, sekumpulan sahabat yang merasakan kekosongan di dada, sekelompok orang yang gemar menyiksa dan lancar berkhianat, sejumlah keluarga yang mencari kejelasan makam anaknya, dan tentang cinta yang tak akan luntur.'),('Home Sweet Loan', 'Almira Bastari', 256, 'Empat orang yang berteman sejak SMA bekerja di perusahaan yang sama meski beda nasib. Di usia 31 tahun, mereka berburu rumah idaman yang minimal nyerempet Jakarta. Kaluna, pegawai Bagian Umum, yang gajinya tak pernah menyentuh dua digit. Gadis ini bekerja sampingan sebagai model bibir, bermimpi membeli rumah demi keluar dari situasi tiga kepala keluarga yang bertumpuk di bawah satu atap. Di tengah perjuangannya menabung, Kaluna dirongrong oleh kekasihnya untuk pesta pernikahan mewah.'),('Rich Dad - Increase Your Financial IQ', 'Robert T. Kiyosaki', 280, 'Rich Dad Poor Dad bukanlah buku mengenai real estat, melainkan mengenai pentingnya pendidikan keuangan. Rich Dad Poor Dad ditulis untuk mempersiapkan Anda dan orang yang Anda kasihi menghadapi kemelut keuangan yang diprediksikan oleh ayah kaya Robert. Pada 2007, saat nilai rumah menyusut dan hilang karena penyitaan, jutaan pemilik rumah dengan pahit mendapati kebenaran kata-kata ayah kaya Robert.')
create table anggota (id INT IDENTITY(1,1) PRIMARY KEY, nama_lengkap NVARCHAR(150), alamat TEXT, no_hp BIGINT)
insert into anggota (nama_lengkap, alamat, no_hp) values ('Orang 1', 'Jalan no 1', 0111111111),('Orang 2', 'Jalan no 2', 022222222222)
create table peminjaman (id INT IDENTITY(1,1) PRIMARY KEY, id_anggota INT, id_buku INT, tanggal_peminjaman DATE, tanggal_pengembalian DATE, status_peminjaman VARCHAR(7))
insert into peminjaman (id_anggota, id_buku, tanggal_peminjaman, tanggal_pengembalian, status_peminjaman) values (1 , 1, '2022-11-01', '2022-11-08', 'selesai'), (2, 2, '2022-12-10', '2022-12-17', 'aktif')
select * from buku
select * from anggota
select * from peminjaman
go

-- Select Where
select * from barang where stok < 10
select * from barang where stok = 10
select * from barang where stok > 10
go

-- Update
update barang set nama_barang = 'buku tulis' where id = 1
select * from barang
go

-- Delete
delete from barang where id = 4
select * from barang
go

-- Drop Tabel
select name from sys.tables
drop table barang
select name from sys.tables
go

-- Drop Databases
drop database market
select name from sys.databases
go

-- Exit SQLCMD
Quit