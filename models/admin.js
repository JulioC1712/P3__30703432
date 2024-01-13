const db = require ('../database/conection');
module.exports = {
    //Hace el reporte de las 3 tablas (categorias, productos e imagenes)
    obteneradmin() {
        return new Promise ((resolve, reject) =>{
            const sql = 'SELECT productos.id, productos.nombre AS productoNombre, productos.precio, productos.codigo, productos.descripcion, productos.marca, productos.deporte, categorias.nombre AS categoriaNombre, imagenes.url, imagenes.destacado FROM productos INNER JOIN categorias ON productos.categoria_id = categorias.id INNER JOIN imagenes ON productos.id = imagenes.producto_id';
            db.all (sql, (err, resultados) =>{
                if (err) reject (err);
                else {
                    console.log(JSON.stringify(resultados, null, 4));
                    resolve (resultados)};
            });
        });
    },
    obtenerctg(){
        return new Promise ((resolve, reject) =>{
            const sql = 'Select * FROM categorias';
            db.all (sql, (err, resultados) =>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    obtenerctgPorId(id){
        return new Promise ((resolve, reject) => {
            const sql = 'SELECT * FROM categorias where id = ?'
            db.get(sql, [id], (err, resultados)=>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    insertarctg(nombre){
        return new Promise ((resolve, reject) =>{
            const sql = 'INSERT INTO categorias (nombre) VALUES (?)';
            db.run(sql, [nombre], (err, resultados) => {
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    actualizarctg(nombre, id){
        return new Promise ((resolve, reject)=>{
            const sql = 'UPDATE categorias SET Nombre = ? WHERE id = ?'
            db.run(sql, [nombre, id], (err) =>{
                if (err) reject(err);
                else resolve();
            });
        });
    },
    eliminarctg(id){
        return new Promise ((resolve, reject)=>{
            const sql = 'DELETE FROM categorias WHERE id = ?'
            db.run(sql, [id], (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    },
    obtenerprd(){
        return new Promise ((resolve, reject) =>{
            const sql = 'SELECT * from productos';
            db.all (sql, (err, resultados) =>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    obtenerprdPorId(id){
        return new Promise ((resolve, reject)=>{
            const sql = 'SELECT * FROM productos WHERE id = ?';
            db.get(sql, [id], (err, resultados)=>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    insertarprd(nombre, precio, codigo, descripcion, marca, deporte, categoria_id){
        return new Promise ((resolve, reject) =>{
            const sql = 'INSERT INTO productos (nombre, precio, codigo, descripcion, marca, deporte, categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.run (sql, [nombre, precio, codigo, descripcion, marca, deporte, categoria_id], (err, resultados)=>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    actualizarprd(nombre, precio, codigo, descripcion, marca, deporte, id){
        return new Promise ((resolve, reject)=>{
            const sql = 'UPDATE productos SET nombre = ?, precio = ?, codigo = ?, descripcion = ?, marca = ?, deporte = ? WHERE id = ?';
            db.run(sql, [nombre, precio, codigo, descripcion, marca, deporte, id], (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    },
    eliminarprd(id){
        return new Promise ((resolve, reject)=>{
            const sql = 'DELETE FROM productos WHERE id = ?';
            db.run(sql, [id], (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });        
    },
    obtenerimg(){
        return new Promise ((resolve, reject) =>{
            const sql = 'SELECT * FROM imagenes';
            db.all(sql, (err, resultados)=>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    obtenerimgPorId(id){
        return new Promise ((resolve, reject)=>{
            const sql = 'SELECT * FROM imagenes WHERE id = ?';
            db.get(sql, [id], (err, resultados)=>{
                if (err) reject(err);
                else { console.log(JSON.stringify(resultados, null, 4));resolve(resultados);
                }
            });
        });
    },
    insertarimg(url, destacado, producto_id){
        return new Promise ((resolve, reject)=>{
            const sql = 'INSERT INTO imagenes (url, destacado, producto_id) VALUES (?, ?, ?)';
            db.run (sql, [url, destacado, producto_id], (err, resultados) =>{
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    },
    actualzarimg(url, destacado, id){
        return new Promise ((resolve, reject)=>{
            const sql = 'UPDATE imagenes SET url = ?, destacado = ? WHERE id = ?';
            db.run (sql, [url, destacado, id], (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    },
    eliminarimg(id){
        return new Promise ((resolve, reject)=>{
            const sql = 'DELETE FROM imagenes WHERE id = ?';
            db.run(sql, [id], (err)=>{
                if (err) reject (err);
                else resolve();
            });
        });
    },
    obtenerClienteEmail(email, password) {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM registroClientes WHERE email = ? AND password = ?';
          db.get(sql, [email, password], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      },
      
      insertarCliente(email, password) {
        return new Promise((resolve, reject) => {
          const sql = "INSERT INTO registroClientes (email, password) VALUES (?, ?)";
          db.run(sql, [email, password], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          });
        });
      },
  
    buscarProductos(nombre, categoria, descripcion, marca, deporte) {
        return new Promise((resolve, reject) => {
          let sql = 'SELECT productos.id, productos.nombre AS productoNombre, productos.precio, productos.codigo, productos.descripcion, productos.marca, productos.deporte, categorias.nombre AS categoriaNombre, imagenes.url, imagenes.destacado FROM productos INNER JOIN categorias ON productos.categoria_id = categorias.id INNER JOIN imagenes ON productos.id = imagenes.producto_id where 1=1';
    
          const params = [];
          if (nombre) {
            sql += " AND productos.nombre LIKE '%' || ? || '%'";
            params.push(nombre);
          }
    
          if (categoria) {
            sql += " AND categorias.nombre = ?";
            params.push(categoria);
          }
    
          if (descripcion) {
            sql += " AND productos.descripcion LIKE '%' || ? || '%'";
            params.push(descripcion);
          }
    
          if (marca) {
            sql += " AND productos.marca = ?";
            params.push(marca);
          }
    
          if (deporte) {
            sql += " AND productos.deporte LIKE '%' || ? || '%'";
            params.push(deporte);
          }
    
          db.all(sql, params, (err, datos) => {
            if (err) {
              reject(err);
            } else {
              resolve(datos);
            }
          });
        });
      },
      obtenerClientes() {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM registroClientes';
          db.all(sql, (err, resultados) => {
            if (err) {
              reject(err);
            } else {
              resolve(resultados);
            }
          });
        });
      },
      obtenerTransacciones() {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM transaccion';
          db.all(sql, (err, resultados) => {
            if (err) {
              reject(err);
            } else {
              resolve(resultados);
            }
          });
        });
      },
      obteneradminPorId(id) {
        return new Promise ((resolve, reject) =>{
            const sql = 'SELECT productos.id, productos.nombre AS productoNombre, productos.precio, productos.codigo, productos.descripcion, productos.marca, productos.deporte, categorias.nombre AS categoriaNombre, imagenes.url, imagenes.destacado FROM productos INNER JOIN categorias ON productos.categoria_id = categorias.id INNER JOIN imagenes ON productos.id = imagenes.producto_id WHERE productos.id = ?';
            db.get (sql, id, (err, resultados) =>{
                if (err) reject (err);
                else {
                    console.log(JSON.stringify(resultados, null, 4));
                    resolve (resultados)};
            });
        });
    },
    obtenerimgPorIdProd(id){
      return new Promise ((resolve, reject)=>{
          const sql = "SELECT * FROM imagenes WHERE producto_id = ?"
          db.get(sql, [id], (err, resultados)=>{
              if (err) reject(err);
              else { 
                resolve(resultados);
              }
          });
      });
  },
  obtenerClientesPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM registroClientes where id=?';
      db.all(sql, id, (err, resultados) => {
        if (err) {
          reject(err);
        } else {
          resolve(resultados);
        }
      });
    });
  },
  insertarTransaccion(transactionId, cantidad, amount, date, ip_cliente, reference, description) {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO transaccion (transaccion_id, cantidad, total_pagado, fecha, ip_cliente, cliente_id, producto_id) VALUES(?,?,?,?,?,?,?)";
      db.run(sql, [transactionId, cantidad, amount, date, ip_cliente, reference, description], (err, resultados) => {
        if (err) {
          reject(err);
        } else {
          resolve(resultados);
        }
      });
    });
  }
};