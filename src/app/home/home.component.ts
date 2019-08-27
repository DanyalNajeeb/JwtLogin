import { Component } from '@angular/core';
// import { first } from 'rxjs/operators';
import { Observable, interval, Subscription } from 'rxjs';
import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { strictEqual } from 'assert';

@Component({ templateUrl: 'home.component.html' })


export class HomeComponent {
    loading = false;
    users: User[];
    DataUser:any;
    private updateSubscription: Subscription;

    constructor( private router: Router,private userService: UserService, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // this.loading = true;
        // this.userService.getAll().pipe(first()).subscribe(users => {
        //     this.loading = false;
        //     this.users = users;
        this.updateSubscription = interval(70000).subscribe(
            (val) => { this.TokenCheck()
          }
      );
        // });
    }
    
   private TokenCheck(){
       
        console.log("In Token Check");
        // console.log(this.authenticationService.TokenShare());
         this.DataUser=this.authenticationService.TokenShare();
         console.log(this.DataUser.refreshToken);
        
       
       
        
         if(this.authenticationService.isTokenExpired(this.DataUser.Token)){
            
          console.log("token is expired");
          console.log(this.DataUser.refreshToken);
          console.log("return Token");
          console.log(this.authenticationService.checktoken(this.DataUser.refreshToken));
          var verify = this.authenticationService.verifyToken();
          if(!verify){
            this.authenticationService.logout();
          }
          
        //   localStorage.removeItem('currentUser');
        //   this.authenticationService.setToken(ReUser);
                // this.authenticationService.logout();
                // this.router.navigate(['/login']);
            
             
         }
         
          
        
         
         
    }


}