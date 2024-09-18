import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

//with Decorator @Injectable, we can use this component/service and inject it into another components. Angular services are Singleton.
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient); //inject() function to inject HttpClient service/requests into this component
  apiUrl = environment.apiUrl;
  currentUser = signal<User | null>(null); //create signal of type User or Null with initial value of null, to get the current user

  login(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/login', model).pipe(
      //map() to transform or do something with the response/user coming from WebAPI
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/register', model).pipe(
      //map() to transform or do something with the response/user coming from WebAPI
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user)); //store the user/token in browser local storage
    this.currentUser.set(user); //sets currentUser with response/user values and creates a signal
  }

  logout() {
    localStorage.removeItem('user'); //remove token from browser local storage
    this.currentUser.set(null); //remove currentUser values
  }
}
