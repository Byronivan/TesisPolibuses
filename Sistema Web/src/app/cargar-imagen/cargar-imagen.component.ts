import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cargar-imagen',
  templateUrl: './cargar-imagen.component.html',
  styleUrls: ['./cargar-imagen.component.css']
})
export class CargarImagenComponent implements OnInit {
  form: FormGroup;
  
  id:string;
  
  public imagePath;
  imgURL: any;
  public message: string;

  constructor(private afs: AngularFirestore,
    private afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(''),

    });
  }

  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  operar(){
    if(!this.form.invalid){
      
      //crear carpeta o referenciar si existe 
      if(this.imagePath != null){
        let ref = this.afStorage.ref(`conductores/${this.afs.createId()}`);
        ref.put(this.imagePath);
      }
    }
}
}
