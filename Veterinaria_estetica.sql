CREATE DATABASE VETERINARIA_ESTETICA
GO
USE VETERINARIA_ESTETICA
GO
CREATE TABLE cliente(
ID_Cliente INT NOT NULL AUTO_INCREMENT,
Fecha_Registro VARCHAR(15) NOT NULL,
Nombre VARCHAR(20) NOT NULL,
Direccion VARCHAR(30) NOT NULL,
Telefono VARCHAR(10) NOT NULL
)

CREATE TABLE mascota(
ID_Mascota INT NOT NULL AUTO_INCREMENT,
ID_Cliente INT NOT NULL,
Fecha_registro VARCHAR(15) NOT NULL,
Nombre VARCHAR(15) NOT NULL,
Raza VARCHAR(15) NOT NULL,
Especie VARCHAR(15) NOT NULL,
Edad INT
)

CREATE TABLE servicio(
ID_Servicio INT NOT NULL AUTO_INCREMENT,
Nombre_Servicio VARCHAR(30) NOT NULL,
Descripcion VARCHAR(40) NOT NULL,
Costo float NOT NULL
)

CREATE TABLE agenda(
ID_Agenda INT NOT NULL AUTO_INCREMENT,
ID_Mascota INT NOT NULL,
Fecha VARCHAR(15) NOT NULL,
Hora VARCHAR(10) NOT NULL,
)

CREATE TABLE venta(
ID_Agenda INT NOT NULL,
ID_Servicio INT NOT NULL,
Total float NOT NULL
)

CREATE TABLE registro_venta(
ID_Registro INT NOT NULL AUTO_INCREMENT,
ID_Agenda INT NOT NULL,
Fecha VARCHAR(15) NOT NULL,
descripcion VARCHAR(100) NOT NULL,
total float NOT NULL
)

/*-----------------------------LLAVE PRIMARIA---------------------------*/
ALTER TABLE cliente ADD CONSTRAINT PK_id_CLIENTE PRIMARY KEY (ID_Cliente)
ALTER TABLE mascota ADD CONSTRAINT PK_id_MASCOTA PRIMARY KEY (ID_Mascota)
ALTER TABLE servicio ADD CONSTRAINT PK_id_Servicio PRIMARY KEY (ID_Servicio)
ALTER TABLE agenda ADD CONSTRAINT PK_id_AGENDA PRIMARY KEY (ID_Agenda)
ALTER TABLE registro_venta

/*-----------------------------LLAVE FORANEA-------------------------------*/
ALTER TABLE mascota ADD CONSTRAINT FK_Id_MASCOTA_CLIENTE FOREIGN KEY (ID_Cliente) REFERENCES cliente(ID_Cliente);
ALTER TABLE agenda ADD CONSTRAINT FK_Id_AGENDA_MASCOTA FOREIGN KEY (ID_Mascota) REFERENCES mascota(ID_Mascota);
ALTER TABLE venta ADD CONSTRAINT FK_Id_Agenda_VENTAS FOREIGN KEY (ID_Agenda) REFERENCES agenda(ID_Agenda);
ALTER TABLE venta ADD CONSTRAINT FK_Id_Agenda_SERVICIO FOREIGN KEY (ID_Servicio) REFERENCES servicio(ID_Servicio);
ALTER TABLE registro_venta ADD CONSTRAINT FK_Id_Agenda_REGISTRO_VENTA FOREIGN KEY (ID_Agenda) REFERENCES agenda(ID_Agenda);

