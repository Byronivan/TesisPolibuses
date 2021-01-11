import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(  
    private afa: AngularFireAuth
    ) { }

  ngOnInit() {
    localStorage.setItem("eslogin", "home");
    this.afa.auth.signOut();
  }

}
