import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const borrarUser = functions.firestore

  .document('usuarios/{id}')
  .onDelete((snap, context) => {
    const id = context.params.id;
    return admin.auth().deleteUser(id);
  });

export const removerFoto = functions.firestore
  .document('conductores/{id}')
  .onDelete((snap, context) => {
    const id = context.params.id;
    console.log('IDSTORAGE: ' + id);
    const storage = admin.storage();
    const bucket = storage.bucket();
    const file = bucket.file(`conductores/${id}`);

    return file.delete();
  });

export const removerFotoBus = functions.firestore
  .document('buses/{id}')
  .onDelete((snap, context) => {
    const id = context.params.id;
    console.log('IDSTORAGE: ' + id);
    const storage = admin.storage();
    const bucket = storage.bucket();
    const file = bucket.file(`buses/${id}`);

    return file.delete();
  });

var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'polibuses2020@gmail.com',
    pass: 'pdkzdbyoaedelvgc'
  }
});

exports.sendEmail = functions.firestore
.document('usuarios/{id}')
.onCreate(async (snap, context) => {

  const clave = await snap.get('clave');
  const nombre = await snap.get('nombre');
  const apellido = await snap.get('apellido');
  const email = await snap.get('email');

  

  var mailOptions = {
    from: 'polibuses2020@gmail.com',
    to: email,
    subject: "Contraseña de ingreso a POLIBUSESWEB",
    html: `
          <h3>Bienvenido(a) ${nombre}&nbsp;&nbsp;${apellido}</h3><br>
          <p>Su cuenta ha sido creada con exito. Las credenciales de acceso son:</p>
          <p>Usuario: ${email}</p>
          <p>Contraseña: ${clave}</p>
      `
    }
     
    try {
      console.log(email, nombre, apellido,clave)
      await mail.sendMail(mailOptions);
      console.log('usuario registrado revisar mail');
    } catch(error) {
      console.error('There was an error while sending the email:', error);
    }
    return null;
  });



/*

export const welcomeMail = functions.firestore
  .document('usuarios/{id}')
  .onCreate((snap, context) => {
      const clave = snap.get('clave');
      const nombre = snap.get('nombre');
      const apellido = snap.get('apellido');
      const email = snap.get('email');
      console.log(nombre);
      console.log(email);
      console.log(clave)
      return sendWelcomeMail(clave, nombre, apellido, email)
  });

function sendWelcomeMail(clave: string, nombre: string, apellido: string, email: string) {
  return transport.sendMail({
      from: "lizbethestefania31@gmail.com",
      to: "byronparedes36@gmail.com",
      subject: "Contraseña de ingreso a POLIBUSESWEB",
      html: `
          <h3>Bienvenido(a) ${nombre}&nbsp;&nbsp;${apellido}</h3><br>
          <p>Su cuenta ha sido creada con exito. Las credenciales de acceso son:</p>
          <p>Usuario: ${email}</p>
          <p>Contraseña: ${clave}</p>
      `
  }).then(r => r).catch(e => e)
}*/

export const enviarNotificacion = functions.firestore
  .document('notificaciones/{id}')
  .onCreate((snap, context) => {

    const data = snap.data();
    var mensaje = data.descripcion;

    var topicName = 'noticias'

    var message = {
      notification: {
        title: data.asunto,
        body: mensaje
      },
      android: {
        notification: {
          icon: 'stock_ticker_update',
          color: '#7e55c3'
        }
      },
      topic: topicName,
    };

    return admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });

  });


export const respuestaFormulario = functions.firestore
  .document('respuestas/{id}')
  .onCreate((snap, context) => {

    const data = snap.data();
    var mensaje = data.descripcion;

    var idtoken = data.token

    var message = {
      notification: {
        title: 'Su ' + data.tipo + ' ha sido respondida',
        body: mensaje
      },
      android: {
        notification: {
          icon: 'stock_ticker_update',
          color: '#7e55c3'
        }
      },
      token: idtoken,
    };

    return admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });

  });


