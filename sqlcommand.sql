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
create database pos
select name from sys.databases
go

-- Pakai DB + Create Table + Insert + Select
use pos
create table barang (id INT, nama_barang NVARCHAR(100), harga INT)
insert into barang (id, nama_barang, harga, stok) values (1, 'buku', 3000),(2, 'pensil', 2000),(3, 'pulpen', 2500),(4, 'penggaris', 2500)
create table kasir (id INT, nama_kasir NVARCHAR(100), )
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