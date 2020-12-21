import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_sevices/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  signupView: boolean = false

  constructor(public authService: AuthenticationService,
    public router: Router) { }

  ngOnInit() {
  }

  toggleSignUpView () {
    this.signupView = !this.signupView
  }
}
