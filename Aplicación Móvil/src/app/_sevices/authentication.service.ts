import { Injectable, NgZone } from '@angular/core';
import { User } from "./../model/user";
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Storage } from '@ionic/storage';

import { first, map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userId: string = "";
  userAuth: boolean = false;
  userPhoto: string = "";

  userName: string = "";
  userEmail: string = "";


  private userProfile: AngularFirestoreDocument<any>;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private fb: Facebook,
    private storage: Storage
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        console.log("USERSERVICE.....  auth = true");
        this.userId = user.uid;
        this.userAuth = true;

        this.userPhoto = user.photoURL;
        this.userName = user.displayName;
        this.userEmail = user.email;

      } else {
        // Empty the value when user signs out
        this.userId = "";
        this.userPhoto = "";
        this.userAuth = false;
        console.log("userId=" + this.userId);
      }
    });
  }

  //metodos para saber si esta logeado

  isLoggedIn(): Promise<any> {
    return this.ngFireAuth.authState.pipe(first()).toPromise();
  }

  updateUserProfile(
    firstname: string, 
    lastname: string, 
    phone: string, 
    email: string, 
  ){
    
    return  this.afStore.doc<any>('userProfile/'+this.userId).update({
      firstname: firstname,
      lastname: lastname,
      phone:phone,
      email: email
    });
  }

  async getAuthState() {
    console.log("userService call getAuthState=" + this.userAuth);
    return await this.userAuth;
  }

  getUserId() {
    return this.userId;
  }

  getUserPhoto() {
    return this.userPhoto;
  }

  getUserInfo() {
    console.log(this.userEmail, this.userName)
    return {
      nombre: this.userName,
      mail: this.userEmail
    }
  }

  getConnectedUserId() {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        console.log("USERSERVICE RUNNNNN...  auth 1");
        this.userId = user.uid;
        this.userAuth = true;
        console.log("userService call getUserId=" + this.userId);
        return this.userId;
      } else {
        console.log("USERSERVICE RUNNNNN...  auth 0");
        // Empty the value when user signs out
        this.userId = null;
        this.userAuth = false;
        console.log("userService call getUserId=" + this.userId);
        return this.userId;
      }
    });

  }

  // login
  signinUser(newEmail: string, newPassword: string): Promise<any> {
    return this.ngFireAuth.signInWithEmailAndPassword(newEmail, newPassword)
  }

  // Register user with email/password
  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

  signupUser(firstname: string, lastname: string, phone: string, username: string, password: string): Promise<any> {
    return this.ngFireAuth.createUserWithEmailAndPassword(username, password).then((newUser) => {
      console.log("userid=========" + newUser.user.uid);   // firebase.database().ref('/userProfile').child(newUser.uid).set({
      this.afStore.collection('userProfile').doc(newUser.user.uid).set({
        id: newUser.user.uid,
        firstname: firstname,
        lastname: lastname,
        email: username,
        image: "",
        phone: phone
      })
    });
  }


  //Recuperar password
  resetPassword(email: string): Promise<any> {
    return this.ngFireAuth.sendPasswordResetEmail(email);
  }


  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }


  signoutUser(): Promise<any> {
    if (this.platform.is('cordova')) {
      this.googlePlus.logout();
      this.fb.logout();
    }
    return this.ngFireAuth.signOut();
  }

  async Google() {
    return await this.googlePlus.login({
      'webClientId': "201597807430-iru69kqetgn1r8h7vr6pua9m2mbk2ndu.apps.googleusercontent.com",
      'offline': true
    }).then(async (res) => {
      return await this.ngFireAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
    })
  }

  loginFacebook() {
    return this.fb.login(['email', 'public_profile'])
      .then((res: FacebookLoginResponse) => {
        const cf = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.ngFireAuth.signInWithCredential(cf);
      })
  }

  //user profile
  async getUserProfileId() {
    const user = await this.isLoggedIn()
    if (user) {
      // do something
      this.userId = await user.uid;
      //return   this.firestore.doc<any>('userProfile/'+this.userId).valueChanges();
    } else {
      // do something else
      console.log("++++++++No userId" + this.userId)
    }
    console.log("++++++++++getUserProfileId = " + this.userId)
    return this.userId;
  }

  getUserProfile() {
    //  this.fireAuth.authState.subscribe(user => {
    //   if (user) {
    //     //this.userId = user.uid;
    //     //console.log("CALL check user auth________________userService user auth id = "+ this.userId);
    //     // set angularfireDoc userfile
    //    // this.userProfile = this.firestore.doc<any>('userProfile/'+this.userId);
    //       //######
    //   }
    // });
    console.log("userId=" + this.userId);
    console.log("getUserProfile");
    return this.afStore.doc<any>('userProfile/' + this.userId).valueChanges();
  }

}

