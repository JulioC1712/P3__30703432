require ('dotenv').config();
var express = require('express');
var router = express.Router();
const productosModel = require ('../models/admin')
var app = express();
var Recaptcha = require('express-recaptcha').RecaptchaV2;
var axios = require('axios');
var nodemailer = require ('nodemailer');
const recaptcha = new Recaptcha('6LdX3k8pAAAAADdUiCYy7BxmUdths4Vjwru4pZdo', '6LdX3k8pAAAAAOW0GS-Oc1OhOcK8EBrGTMmHEReZ');
app.use(recaptcha.middleware.verify);
app.use(express.json());
const transporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
    user: process.env.email, 
    pass: process.env.clave_email
  } });


router.get('/login', function(req, res, next) {
  if (req.session.auth) {
    res.redirect("/home");
  } else if (req.session.userId == null){
    res.render('index', { title: 'Login' });
  } else {
    res.redirect('/');
  }
});


//Pagina principal compras
router.get('/', function(req, res, next){
  const userId = req.session.userId;
  productosModel
    .obteneradmin()
    .then(datos=>{
      res.render('catalogo', {datos: datos, userId});
    }) 
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error cargando archivos')
    })
});
//Busqueda productos
router.post('/buscar', (req, res) => {
  const userId = req.session.userId;
  const { nombre, categoria, descripcion, marca, deporte, promedio } = req.body;

  productosModel
  .buscarProductos(nombre, categoria, descripcion, marca, deporte, promedio)
    .then(datos => {
      res.render("catalogo", { datos, userId});
    })
    .catch(err => {
      console.error(err.message);
      return res.status(500).send("Error buscando productos");
    });
});

//login a la pagina del administrador
router.post('/login', function(req, res, next){
  const {user, password} = req.body;
  if ((process.env.USER == user) && (process.env.PASSWORD == password)) {
    req.session.auth = true;
    res.redirect('/home');
  } else{
    res.render('loginfail', {title: 'Login Fail'});
  }
});

//Get principal page
router.get('/home', function(req, res, next){
  if (req.session.auth) {
    res.render('admin');
  } else {
    res.redirect("/login");
  }
 
});

//Get productos page
router.get('/productos', function(req, res, next){
  if (req.session.auth) {
    productosModel
    .obtenerprd()
    .then(productos =>{
      res.render('productos', {productos: productos});
    })
    .catch(err =>{
      return res.status(500).send("Error buscando producto");
    })
  } else {
    res.redirect("/login");
  }
 
});

//Get categorias page
router.get('/categorias', function(req, res, next){
  if (req.session.auth) {
    productosModel
    .obtenerctg()
    .then(categorias =>{
      res.render('categorias', {categorias: categorias});
    })
    .catch(err =>{
      return res.status(500).send("Error buscando categorias");
    })
  } else {
    res.redirect("/login");
  }
 
});

//Get imagenes page
router.get('/imagenes', function(req, res, next){
  if (req.session.auth) {
    productosModel
    .obtenerimg()
    .then(imagenes =>{
      res.render('imagenes', {imagenes: imagenes});
    })
    .catch(err =>{
      return res.status(500).send("Error buscando imagenes");
    })
  } else {
    res.redirect("/login");
  }
 
});

//Get productos page agg
router.get('/prdagg', function(req, res, next){
  if (req.session.auth) {
    productosModel
  .obtenerctg()
  .then(categorias=>{
    res.render('aggprd', {categorias: categorias});
  })
  .catch(err =>{
    return res.status(500).send("Error a cargar la pagina");
  })
  } else {
    res.redirect("/login");
  }
  
})    

//Get categorias page agg
router.get('/ctgagg', function(req, res, next){
  if (req.session.auth) {
    res.render('aggctg');
  } else {
    res.redirect("/login");
  }
 
})

//Get imagenes page agg
router.get('/imgagg', function(req, res, next){
  if (req.session.auth) {
    productosModel
    .obtenerprd()
    .then(productos=>{
      res.render('aggimg', {productos: productos});
    })
    .catch(err =>{
      return res.status(500).send("Error a cargar la pagina");
    })
  } else {
    res.redirect("/login");
  }
})

//agregar categoria
router.post('/aggctg', function(req, res, next){
  if (req.session.auth) {
    const {nombre} = req.body;
    console.log(nombre);
    productosModel
    .insertarctg(nombre)
    .then(idCategoriaInsertado =>{
      res.redirect('/categorias');
    })
    .catch(err =>{
      console.error(err.message);
      return res.status(500).send("Error insertando producto");
    });
  } else {
    res.redirect("/login");
  }
 
})

//agregar producto
router.post('/aggprd', function(req, res, next){
  if (req.session.auth) {
    const {nombre, precio, codigo, descripcion, marca, deporte, categoria_id} = req.body;
    productosModel
    .insertarprd(nombre, precio, codigo, descripcion, marca, deporte, categoria_id)
    .then(idProductoInsertado =>{
      res.redirect('/productos');
    })
    .catch(err =>{
      console.error(err.message);
      return res.status(500).send("Error insertando producto");
    })
  } else {
    res.redirect("/login");
  }
 
});

//agregar imagenes
router.post('/aggimg', function(req, res, next){
  if (req.session.auth) {
    const {url, destacado, producto_id} = req.body;
  productosModel
  .insertarimg(url, destacado, producto_id)
  .then(idImagenInsertada=>{
    res.redirect('/imagenes');
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error insertando imagen');
  })
  } else {
    res.redirect("/login");
  }
});

//Get productos page edit
router.get('/prdedit/:id', function(req,res,next){
  if (req.session.auth) {
    const id=req.params.id;
    productosModel
    .obtenerprdPorId(id)
    .then(productos=>{
      res.render('editprd', {productos: productos});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando el producto')
    })
  } else {
    res.redirect("/login");
  }
 
});

//Get categorias page edit
router.get('/ctgedit/:id', function(req,res,next){
  if (req.session.auth) {
    const id=req.params.id;
    productosModel
    .obtenerctgPorId(id)
    .then(categorias=>{
      res.render('editctg', {categorias: categorias});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando la categoria')
    })
  } else {
    res.redirect("/login");
  }

});

//Get imagenes page edit
router.get('/imgedit/:id', function(req,res,next){
  if (req.session.auth) {
    const id=req.params.id;
    productosModel
    .obtenerimgPorId(id)
    .then(imagenes=>{
      res.render('editimg', {imagenes: imagenes});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando la imagen')
    })
  } else {
    res.redirect("/login");
  }
});

//Update productos page
router.post('/updateprd/:id', function(req, res, next){
  const id= req.params.id;
  const {nombre, precio, codigo, descripcion, marca, deporte} = req.body;
  productosModel
  .actualizarprd(nombre, precio, codigo, descripcion, marca, deporte, id)
  .then(()=>{
    res.redirect('/productos');
  })
  .catch(err =>{
    console.error(err.message);
    res.status(500).send('Error actualizando el producto');
  })
});

//Update categorias page
router.post ('/updatectg/:id', function(req, res, next){
  const id = req.params.id;
  const {nombre} = req.body;
  productosModel
  .actualizarctg(nombre, id)
  .then(()=>{
    res.redirect('/categorias');
  })
  .catch(err =>{
    console.error(err.message);
    res.status(500).send('Error actualizando la categoria');
  })
});

//Update imagenes page
router.post('/updateimg/:id', function(req, res, next){
  const id = req.params.id;
  const {url, destacado} = req.body;
  productosModel
  .actualzarimg(url, destacado, id)
  .then(()=>{
    res.redirect('/imagenes');
  })
  .catch(err =>{
    console.error(err.message);
    res.status(500).send('Error actualizando la imagen');
  })
});

//Get productos page delete
router.get('/prddelete/:id', function(req,res,next){
  if (req.session.auth) {
    const id=req.params.id;
    productosModel
    .obtenerprdPorId(id)
    .then(productos=>{
      res.render('deleteprd', {productos: productos});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando el producto')
    })
  } else {
    res.redirect("/login");
  }
 
});

//Get categorias page delete
router.get('/ctgdelete/:id', function(req,res,next){
  if (req.session.auth) {
    const id=req.params.id;
    productosModel
    .obtenerctgPorId(id)
    .then(categorias=>{
      res.render('deletectg', {categorias: categorias});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando la categoria')
    })
  } else {
    res.redirect("/login");
  }
 
});

//Get imagenes page delete
router.get('/imgdelete/:id', function(req,res,next){
  if (req.session.auth) {
    const id=req.params.id;
  productosModel
  .obtenerimgPorId(id)
  .then(imagenes=>{
    res.render('deleteimg', {imagenes: imagenes});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando la imagen')
  })
  } else {
    res.redirect("/login");
  }
  
});

//Delete productos page
router.get('/deleteprd/:id', function(req,res,next){
  if (req.session.auth) {
    const id = req.params.id;
    productosModel
    .eliminarprd(id)
    .then(()=>{
      res.redirect('/productos');
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error elimando el producto')
    })
  } else {
    res.redirect("/login");
  }
 
});

//Delete categorias page
router.get('/deletectg/:id', function(req,res,next){
  if (req.session.auth) {
    const id = req.params.id;
    productosModel
    .eliminarctg(id)
    .then(()=>{
      res.redirect('/categorias');
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error elimando la categoria')
    })
  } else {
    res.redirect("/login");
  }

});

//Delete imagenes page
router.get('/deleteimg/:id', function(req,res,next){
  if (req.session.auth) {
    const id = req.params.id;
    productosModel
    .eliminarimg(id)
    .then(()=>{
      res.redirect('/imagenes');
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error elimando la imagen')
    })
  } else {
    res.redirect("/login");
  }

});
//Cerrar sesion
router.get('/logout', function (req, res, next){
  req.session.destroy();
  res.redirect('/');
})
router.get('/registroClientes', recaptcha.middleware.render, (req, res)  =>{
  if (req.session.auth) {
    res.redirect('/home')
  } else {
    if (req.session.userId == null) {
      res.render('registroclientes' , { captcha: res.recaptcha })
  } else {
    res.redirect('/')
  }
  }

  

});
router.post('/registroClientes', (req, res) => {
  const { email, password } = req.body;
  recaptcha.verify(req, (error, recaptchadatos) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error en el servidor');
    } else {
      productosModel.obtenerClienteEmail(email, password)
        .then((cliente) => {
          if (cliente) {
            return res.redirect('/inicioSesionClientes');
          } else {
            const mailOptions = { 
              from: process.env.email, 
              to: email, 
              subject: `Registro completado`, 
              text: `Hola.\nBienvenido a Tienda Fitness\n\nSu registro ha sido realizado correctamente.` 
            };
      
            transporter.sendMail(mailOptions, function(error, info){ 
              if (error) { console.log(error); 
              } else { 
                console.log('Correo electrónico de registro exitoso:  ' + info.response); 
            }});
            productosModel.insertarCliente(email, password)
              .then(() => {
                req.session.userId = this.lastID;
                req.session.auth = false;
                return res.redirect('/');
              })
              .catch(err => {
                console.error(err);
                return res.status(500).send('Error en el servidor');
              });
          }
        })
        .catch(err => {
          console.error(err);
          return res.status(500).send('Error en el servidor');
        });
    }
  });
});
router.get('/inicioSesionClientes', (req,res) =>{
  if (req.session.auth == true ){
    res.redirect('/home')
  }else{
    if (req.session.userId == null ){
      res.render('inicioSesionClientes')
    }else{
      res.redirect ('/')
    }
  }
 });


 router.post('/inicioSesionClientes', (req, res) => {
  const { email, password } = req.body;

  productosModel.obtenerClienteEmail(email, password)
    .then((cliente) => {
      if (cliente) {
        req.session.userId = cliente.id;
        req.session.auth = false; 
        res.redirect('/'); 
      } else {
        res.status(401).send('Credenciales incorrectas'); 
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error interno del servidor'); 
    });
}); 
// administrador
router.get('/clientes', (req, res) => {
  if (req.session.auth) {
    productosModel
    .obtenerClientes()
    .then(Clientes =>{
      res.render('clientes', {Clientes: Clientes});
    })
    .catch(err =>{
      return res.status(500).send("Error buscando clientes");
    })
  } else {
    res.redirect("/login");
  }
 
});
router.get('/transacciones', (req, res) => {
  if (req.session.auth) {
    productosModel
    .obtenerTransacciones()
    .then(transaccion =>{
      res.render('transaccion', {transaccion});
    })
    .catch(err =>{
      return res.status(500).send("Error buscando transaccion");
    })
  } else {
    res.redirect("/login");
  }
 
});
router.get('/detalles/:id', function(req, res, next) {
  const id = req.params.id;
    productosModel
    .obteneradminPorId(id)
    .then(productos=>{
      res.render('detalles', {productos});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando el producto')
    })

});
router.get('/pagar/:id', (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;
  if (req.session.userId == null) {
    return res.redirect('/registroClientes');
  } else if (req.session.auth) {
    return res.redirect('/home');
  } else {
    productosModel.obteneradminPorId(id)
      .then(productos => {
        productosModel.obtenerClientesPorId(userId)
          .then(clientes => {
            res.render('pagar', { productos, clientes, id, userId });
          })
          .catch(err => {
            console.error(err.message);
            return res.status(500).send('Error buscando el cliente');
          });
      })
      .catch(err => {
        console.error(err.message);
        return res.status(500).send('Error buscando el producto');
      });
  }
});
router.post('/payments', async (req, res) => {
  const ip_cliente = req.ip;
  const {
    cvv,
    'expiration-month': expirationMonth,
    'expiration-year': expirationYear,
    name: fullName,
    "card-number": tarjeta,
    precio,
    nombre, 
    email,
    id: idProducto,
    idCliente: idCliente,
    cantidad
  } = req.body;
  const precioProducto = (precio * cantidad).toFixed(2);
  const payment = {
    amount: precioProducto,
    'card-number': tarjeta,
    cvv,
    'expiration-month': expirationMonth,
    'expiration-year': expirationYear,
    'full-name': fullName,
    currency: 'USD',
    description: idProducto,
    reference: idCliente
  };

  try {
    const response = await axios.post('https://fakepayment.onrender.com/payments', payment, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJkYXRlIjoiMjAyNC0wMS0xM1QxNTozNTo1MS4zMTNaIiwiaWF0IjoxNzA1MTYwMTUxfQ.4jzofHpgc9ZLjABXAM_n2sk4Qzi-ZJkZr2tcsmAiUp8'
      }
    });
    const datos = JSON.parse(JSON.stringify(response.data));
    const transactionId = datos.data.transaction_id;
    const amount = datos.data.amount;
    const date = datos.data.date;
    const reference = datos.data.reference;
    const description = datos.data.description;
    req.session.datos = datos;
   productosModel
   .insertarTransaccion(transactionId, cantidad, amount, date, ip_cliente, reference, description)
   .then(datos=>{
    const mailOptions = { 
      from: process.env.email, 
      to: email, 
      subject: `Compra completada`, 
      text: `¡Hola, ${fullName}!\n\nGracias por tu compra.\nDetalles:\n\nTransacción: ${transactionId}\nProducto: ${nombre} \nCantidad: ${cantidad}\nTotal pagado: ${precioProducto} USD\n\nGracias por elegirnos. ¡Esperamos verte pronto de nuevo!`

    };

    transporter.sendMail(mailOptions, function(error, info){ 
      if (error) { console.log(error); 
      } else { 
        console.log('Correo electrónico de compra de contraseña enviado: ' + info.response); 
    }});
    res.redirect("/transaccion");
  })
  .catch(error=>{
    res.render('transaccionres', { error, datos : null, idProducto });
    console.log(error);
  })
  
  } catch (error) {
    res.render('transaccionres', { error, datos : null, idProducto });
    console.log(error);
  }
});
router.get('/transaccion', (req, res) => {
  if (req.session.userId == null) {
    res.redirect("/");
  } else if (req.session.auth) {
    res.redirect("/home");
  } else {
    const datos = req.session.datos;

    res.render('transaccionres', { datos, error: null });
  
    delete req.session.datos;
  }
});

router.get('/recuperar', function(req, res, next){
  if (req.session.userId) {
    res.redirect("/");
  } else if (req.session.auth) {
    res.redirect("/home");
  } else {
  res.render('recuperar');
  }
});

router.post('/recuperar', function(req, res, next) {
  const { email } = req.body;
  productosModel
    .recuperarclave(email)
    .then(datos => {
      if (datos) {
        req.session.link = true;
        const mailOptions = {
          from: process.env.email,
          to: datos.email,
          subject: 'Restablecer Contraseña',
          text: `Hola, has solicitado restablecer tu contraseña.\nHaz clic en el siguiente enlace para continuar: \n\n ${process.env.base_url}/recuperacion/${datos.id}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Correo electrónico de recuperación de contraseña enviado: ' + info.response);
          }
        });
        res.send('Correo electrónico de recuperación de contraseña enviado');
      } else {
        res.send('No se encontró ningún cliente con ese correo electrónico');
      }
    })
    .catch(err => {
      console.error(err.message);
      return res.redirect('/recuperar');
    });
});
//Pagina restablecer contraseña
router.get('/recuperacion/:id', function(req, res, next){
  const id = req.params.id;
  if (req.session.userId) {
    res.redirect("/");
  } else if (req.session.auth) {
    res.redirect("/home");
  } else {
    if (req.session.link) {
      productosModel
      .obtenerClientesPorId(id)
      .then(datos=>{
        res.render('recuperacion', {datos: datos});
      })
      .catch(err=>{
        console.error(err.message);
        return res.status(500).send('No se encuentra ese cliente');
      });
    } else {
      res.redirect('/recuperar');
    }
  }
});

//Restablecer Contraseña
router.post('/recuperacion/:id', function(req, res, next){
  const cliente_id= req.params.id;
  console.log(cliente_id);
  req.session.link = false;
  const {password} = req.body;
    productosModel
    .restablecerclave(password, cliente_id)
    .then(()=>{
      res.send('Contraseña recuperada de manera exitosa');
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error restableciendo contraseña');
    })
});
router.get('/productos-comprados', function(req, res, next){
  if (req.session.userId) {
    const cliente_id = req.session.userId;
    console.log(cliente_id);
    productosModel
    .obtenertransaccionPorCliente(cliente_id)
    .then(datos=>{
      res.render('listacomprados', {datos: datos});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando archivos');
    })
  } else{
    res.redirect('/inicioSesionClientes');
  }
})

//Pagina para calificar un producto
router.get('/calificar/:id', function(req, res, next){
  if (req.session.userId){
    const id = req.params.id;
    productosModel
    .obtenerprdconimgPorId(id)
    .then(producto=>{
      res.render('calificar', {producto:producto});
    })
    .catch(err=>{
      console.error(err.message);
      return res.status(500).send('Error buscando productos');
    })
  }else{
    res.redirect('/inicioSesionClientes');
  }
});

//Califar producto
router.post('/calificacion', function(req, res, next){
  const {producto_id, puntos}= req.body;
  const cliente_id = req.session.userId;
  productosModel
  .calificarprd(puntos, cliente_id, producto_id)
  .then(idProductoCalificado=>{
    res.redirect('/productos-comprados');
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error calificando productos');
  })
});


router.get('/*', function(req, res, next) {
  res.render('error', { title: 'Error 404'});
});
module.exports = router;