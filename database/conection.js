const sqlite3 = require ('sqlite3').verbose();
const path = require ('path');


//Conection Data Base
const db_name = path.join(__dirname, '../db', 'base.db');
const db = new sqlite3.Database(db_name, err =>{
    if (err) { 
        console.error(err.message);
    }else {
        console.log('conexion a la Base de Datos Exitosa!!!');
    }
});

db.serialize(() =>{
  const sql_create="CREATE TABLE IF NOT EXISTS categorias ( id INTEGER PRIMARY KEY  AUTOINCREMENT, nombre varchar (25) NOT NULL);";
  db.run(sql_create, err =>{
    if (err) {
      console.error (err.message);
    } else {
      console.log("Anexada de la tabla categorias exitosa!!!");
    }
  })
const sql_create2="CREATE TABLE IF NOT EXISTS productos ( id INTEGER PRIMARY KEY AUTOINCREMENT, nombre varchar (25) NOT NULL, precio double NOT NULL, codigo INTEGER NOT NULL UNIQUE, descripcion varchar (60) NULL DEFAULT 'Sin descripcion', marca varchar (25) NOT NULL, deporte TEXT NOT NULL, categoria_id INTEGER, FOREIGN KEY (categoria_id) REFERENCES categorias (id));";
db.run(sql_create2, err =>{

  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla productos exitosa!!!");
  }
})
const sql_create3="CREATE TABLE IF NOT EXISTS imagenes ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, url TEXT NOT NULL, destacado TEXT NOT NULL, producto_id INTEGER, FOREIGN KEY (producto_id) REFERENCES productos (id));";
db.run(sql_create3, err =>{
  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla imagenes exitosa!!!");
  }
});
const sql_create4= "CREATE TABLE IF NOT EXISTS registroClientes ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email text, password TEXT)"; 
db.run(sql_create4, err =>{
  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla registroclientes exitosa!!!");
  }
});
const sql_create5= "CREATE TABLE IF NOT EXISTS transaccion ( transaccion_id text PRIMARY KEY, cantidad INTEGER,total_pagado FLOAT,fecha datetime,ip_cliente TEXT,cliente_id text,producto_id text,FOREIGN KEY(cliente_id) REFERENCES registroClientes(id),FOREIGN KEY(producto_id) REFERENCES productos(id))";
db.run(sql_create5, err =>{
  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla transaccion exitosa!!!");
  }
});
const sql_create6="CREATE TABLE IF NOT EXISTS calificaciones (id INTEGER PRIMARY KEY AUTOINCREMENT, puntos INTEGER NOT NULL, cliente_id INTEGER, producto_id INTEGER, FOREIGN KEY (cliente_id) REFERENCES clientes (id), FOREIGN KEY (producto_id) REFERENCES productos (id))";
db.run(sql_create6, err =>{
  if (err){
    console.error(err.message);
  }else{
    console.log("Anexada de la tabla calificaciones exitosa!!!");
  }
});
db.all("PRAGMA table_info(productos)", (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const columnExists = rows && Array.isArray(rows) && rows.some(row => row.name === 'promedio');
  if (!columnExists) {
    const sql_create7="ALTER TABLE productos ADD promedio float DEFAULT 0";
    db.run(sql_create7, err =>{
      if (err) {
        console.error(err.message);
      } else{
        console.log("Columna promedio de la tabla productos EXITOSA!!! ");
      }
    });
  } 
});
})

module.exports = db;