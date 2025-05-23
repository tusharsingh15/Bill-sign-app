import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: false
})
export class LoginPagePage {
  username: string = '';
  password: string = '';

  // users list
  private users = [
    { username: 'admin', password: 'password123' },
    { username: 'user1', password: 'user123' },
    { username: 'test', password: 'test123' }
  ];

  constructor(private router: Router) {}

  login() {
    if (this.username.trim() === '' || this.password.trim() === '') {
      console.log('Please enter both username and password');
      return;
    }

    
    const user = this.users.find(u => u.username === this.username && u.password === this.password);

    if (user) {
      console.log('Login successful!');

      // Send username to PC via ADB
      this.sendUsernameToPC(this.username);

      // Save login status
      localStorage.setItem('isLoggedIn', 'true');

      // Redirect to home page
      this.router.navigate(['/home']);
    } else {
      console.log('Invalid credentials');
    }
  }

  // sendUsernameToPC(username: string) {
  //   const adbCommand = `adb shell "log -t MyApp USERNAME:${username}"`;
  //   console.log('Sending username to PC:', adbCommand);
  // }

  sendUsernameToPC(username: string) {
    const jsonPayload = {
      type: 'login',
      data: { username }
    };
  
    const jsonString = JSON.stringify(jsonPayload).replace(/"/g, '\\"');
    const adbCommand = `adb shell "log -t EVENT_TRIGGER \\"${jsonString}\\""`;
  
    console.log('Sending login JSON to PC:', adbCommand);
  }
  

}
