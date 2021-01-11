import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from '../_model/usuarios';
import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  user: Observable<Usuario>;
  usuario: string;
  url: string;

  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private snackBar: MatSnackBar,
    private afStorage: AngularFireStorage

  ) {
    this.user = this.afa.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<Usuario>(`usuarios/${user.uid}`).valueChanges();
        } else {
          return EMPTY;
        }
      })
    )
  }

  login(usuario: string, clave: string) {
    return this.afa.auth.signInWithEmailAndPassword(usuario, clave).then(res => {
      this.actualizarUsuarioData(res.user);
      localStorage.setItem("usuario", res.user.email);
      
      this.afs.collection('usuarios').doc(res.user.uid).get().subscribe(res=>{
        let usInfo = res.data()
        localStorage.setItem("rol", usInfo.rol[0]);
      });
      
      
      
      this.afStorage.ref(`usuarios/${res.user.uid}`).getDownloadURL().subscribe(data => {
        this.url = data;
        localStorage.setItem("url", this.url)
      }, (error) => {
        this.url = 'sin url';
        localStorage.setItem("url", this.url)
      })
      this.router.navigate(['/perfil']);
    }).catch(error => {
      console.log(ErroAuthEn.convertMessage(error['code']))
      this.snackBar.open(ErroAuthEn.convertMessage(error['code']), 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    })
  }

  private actualizarUsuarioData(usuario: any) {

    const userRef: AngularFirestoreDocument<Usuario> = this.afs.doc(`usuarios/${usuario.uid}`);

    let obs = userRef.valueChanges().subscribe(data => {
      if (data) {
        const datos: Usuario = {
          uid: usuario.uid,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          celular: usuario.celular,
          cedula: usuario.cedula,
          email: usuario.email,
          rol: data.rol,
          clave: data.clave
        }
        return userRef.set(datos);
      } else {
        const datos: Usuario = {
          uid: usuario.uid,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          celular: usuario.celular,
          cedula: usuario.cedula,
          email: usuario.email,
          rol: data.rol,
          clave: data.clave
        }
        return userRef.set(datos);
      }
    });
    obs.unsubscribe();
  }


  restablecerClave(email: string) {
    return this.afa.auth.sendPasswordResetEmail(email).then(() => {
      this.snackBar.open('Correo enviado exitosamente', 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      })
      this.router.navigate(['/home'])
    }).catch(error => {
      this.snackBar.open(ErroAuthEn.convertMessage(error['code']), 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    })
  }

  estaLogeado() {
    return this.afa.auth.currentUser != null;
  }

  getCurrentUser() {
    if (localStorage.getItem("usuario") !== undefined && localStorage.getItem("url") !== undefined) {
      return {
        usuario: localStorage.getItem("usuario"),
        url: localStorage.getItem("url"),
      }
    } else if (localStorage.getItem("usuario") !== undefined && localStorage.getItem("url") == 'sin url' ) {
      return {
        usuario: localStorage.getItem("usuario"),
        url: 'sin url',
      }

    } else {
      return {
        usuario: 'sin user',
        url: 'sin url'
      }
    }
  }

  islogged(): boolean {
    if (this.usuario != null) {
      return true
    } else if (localStorage.getItem("usuario") != null) {
      return true
    } else {
      return false;
    }
  }

  cerrarSesion() {
    localStorage.removeItem("usuario")
    localStorage.removeItem("url")
    localStorage.removeItem("rol")
    localStorage.clear();
    return this.afa.auth.signOut().then(() => {
      this.router.navigate(['home']);
    });
  }
}


export namespace ErroAuthEn {
  export function convertMessage(code: string): string {
    console.log('called');
    switch (code) {
      case 'auth/user-disabled': {
        return 'Lo sentimos su usuario esta deshabilitado.';
      }

      case 'auth/user-not-found': {
        return 'Usuario no encontrado, ingrese nuevamente.';
      }

      case 'auth/wrong-password': {
        return 'La contraseña ingresada no es válida.';
      }

      case 'auth/invalid-email': {
        return 'Formato de correo no válido.';
      }

      case 'auth/invalid-password': {
        return 'El valor que se proporcionó para la propiedad password no es válido.';
      }

      default: {
        return 'Error al ingresar, intentelo más tarde';
      }
    }
  }
}
