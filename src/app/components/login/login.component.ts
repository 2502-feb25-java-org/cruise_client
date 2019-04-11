import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { RiderService } from '../../services/rider/rider.service'
import { Rider } from '../../models/rider/rider'
import { WindowRef } from '@agm/core/utils/browser-globals';
//import { rider } from '../../app.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //===Strings===
  username: string;
  userErrMsg: string;
  pswErrMsg: string;
  loginErrMsg: string;
  rememberBox;

  //===Objects===
  rider: Rider;

  constructor(private rService: RiderService) { }

  ngOnInit() {
    if (localStorage.getItem('rememberMe') == 'true') {
      this.username = localStorage.getItem('storedUsername');
      this.rememberBox = localStorage.getItem('rememberMe');
    }
    else {
      this.username = "";
      this.rememberBox = false;
    }
  }

  //===Methods===
  validUsername(username: string) {
    if (username == null || username == "") {
      this.userErrMsg = "Please enter a username!";
      return false;
    }
    else {
      this.userErrMsg = "";
      return true;
    }
  }
  validPassword(password: string) {
    if (password == null || password == "") {
      this.pswErrMsg = "Please enter a password.";
    }
    else {
      this.pswErrMsg = "";
    }
  }
  remember() {
    if (this.rememberBox) {

      localStorage.setItem('storedUsername', this.username);
      localStorage.setItem('rememberMe', this.rememberBox);
    }
    else {
      localStorage.setItem('rememberMe', this.rememberBox);
      localStorage.setItem('storedUsername', "");
    }
  }

  login(username: string, password: string) {
    this.rService.getByUsernameAndPassword(username, password).subscribe(
      myRespBody => {
        if (myRespBody != null) {
          this.rider = myRespBody;
          console.log("User recieved!" + JSON.stringify(this.rider));
          this.loginErrMsg = '';
          RiderService.globalRider = this.rider; //must make global rider public static
        }
        else {
          console.log("User not found");
          this.loginErrMsg = "Username or Password not found";
        }
      },
      error => console.log('ERR')
    );
  }
  //===Super function called by login_btn===
  submit(username: string, password: string) {
    if (this.validUsername(username) || this.validPassword(password)) {
      this.remember();
      this.login(username, password);
      window.location.href = "/home"; //redirects a user
    }
    else {
      alert('Please fillout all forms!');
    }
  }
}
