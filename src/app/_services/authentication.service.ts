import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { noUndefined } from '@angular/compiler/src/util';
import * as jwt_decode from 'jwt-decode';
import { resource } from 'selenium-webdriver/http';
@Injectable({ providedIn: 'root' })


export class AuthenticationService {
    private PreviousUser:any ={
        Token:'',
        refreshToken:'',
        email:'',
        password:'',
        _id:''
    }

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    
    
    private PreviousToken:string;
    private PreviousEmail:string;

    // private messageSource = currentUserValue();
    

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse( localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }



    login(email: string, password: string) {

        return this.http.post<any>(`${environment.apiUrl}/signin`, { email, password })
            .pipe(map(user => {
                console.log(user.token);
                console.log("before");
                console.log(user.token);
                console.log(email);
                console.log(password);
                console.log(user._id);
                
                console.log("After");
                console.log(this.PreviousToken);
                if(this.PreviousToken == undefined){
                        console.log("NO previous token")
                       this.PreviousUser.Token=user.token;
                       console.log("refresh token");
                       console.log(user.refreshToken);
                       this.PreviousUser.refreshToken=user.refreshToken;
                        this.PreviousUser.email=email
                        this.PreviousUser.password=password;
                        this.PreviousUser._id=user._id;
                        // this.PreviousEmail= email;
                        // this.PreviousToken=user.token;
                }else{

                    if(this.PreviousToken != user.token){
                        console.log("token doesnt match");
                    }
                }
                

                // store user details and jwt token in local storage to keep user logged in between page refreshes
              this.setToken(user.token);
                // localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
            
    }


    setToken(token: any): void {
        console.log('in set token');
        console.log(token);
        localStorage.setItem('currentUser', JSON.stringify(token));
        this.currentUserSubject.next(token);
      }

    TokenShare(){
        console.log("in Token Share");
        
        return this.PreviousUser;
        // console.log(this.messageSource);
        // return this.messageSource;
    }
    getToken(): string {
        console.log("in get token")
        console.log(localStorage.getItem('currentUser'));
        var retrievedObject=localStorage.getItem('currentUser');
        console.log(retrievedObject);
        return JSON.parse(retrievedObject); 
        

      }

      getTokenExpirationDate(token: string): Date {
          console.log('in gettokenExpirtaiondate');
          console.log(token);
        const decoded = jwt_decode(token);
             console.log(decoded);
        if (decoded.exp === undefined) return null;
    
        const date = new Date(0); 
        console.log(date);
        date.setUTCSeconds(decoded.exp);
        console.log(date);
        return date;
      }

      isTokenExpired(token?: string): boolean {
          console.log('in IstokenExpire');
        if(!token) token = this.getToken();
        if(!token) return true;
    
        const date = this.getTokenExpirationDate(token);
        console.log(date);
        if(date === undefined) return false;

        console.log(date.valueOf());
        console.log(Date.valueOf());
        return !(date.valueOf() > new Date().valueOf());
      }
    




    // checktoken(email:string,token:string){
    //     console.log(email);
    //     console.log(token);

    //     return this.http.post<any>(`${environment.apiUrl}/tokencheck`, { email, token})
    //     .pipe(map(user => {
    //         if (user.email && user.token) {
    //           console.log("hola");
    //         }
    //         console.log("out of hola");
    //       })

    //     );
    //     //  this.http.post<any>(`${environment.apiUrl}/tokencheck`, { email, token })
        
    //     // return this.http.post<any>(`${environment.apiUrl}/signin`, { , password })
    // //    return this.http.post<any>(`${environment.apiUrl}/signin`, { email, password })
    // //         .pipe(map(user => {
    // //             console.log(user.token);
    // //             console.log("before");
    // //             console.log(this.PreviousToken);
                
    // //             console.log("After");
    // //             console.log(this.PreviousToken);
    // //             if(this.PreviousToken == undefined){
    // //                     console.log("NO previous token")
    // //                     this.PreviousToken=user.token;
    // //             }else{

    // //                 if(this.PreviousToken != user.token){
    // //                     console.log("token doesnt match");
    // //                 }
    // //             }
                

    // //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    // //             localStorage.setItem('currentUser', JSON.stringify(user));
    // //             this.currentUserSubject.next(user);
    // //             return user;
    // //         }));
 
 
    // }








verifyToken():boolean{
   var token = this.getToken();
   console.log("verify token method");
   console.log(token);
    var verification=true;

   this.http.post(`${environment.apiUrl}/secure`, { token })
   .subscribe((result) => {
       console.log("Verified token");
       console.log(result);
       verification=true;
       console.log(verification);
    //    this.setToken(result);
       // return result;
   });
   if(verification){
       return true;
   }
   else{
       return false;
    }

 


    //  return this.http.post(`${environment.apiUrl}/secure`,{token})
    // .subscribe((result) => {
    //     console.log("Verify result");
    //     // console.log(result);
    //     // this.setToken(result);
    //     // return result;
    // }); 
}

    generateNewToken(refreshToken:string){
    
    }
    checktoken(refreshToken: string) {
    console.log("in check token");
    console.log(refreshToken);
    this.http.post(`${environment.apiUrl}/token`, { refreshToken })
    .subscribe((result) => {
        console.log("result");
        console.log(result);
        this.setToken(result);
        // return result;
    });
      

            
            
            

            
        // return this.http.post<any>(`${environment.apiUrl}/token`, { refreshToken })
        //     .pipe(map(user => {
        //         console.log(user.token);
        //         // this.currentUserSubject.next(user);
        //         return user;
        //     }));
            
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}