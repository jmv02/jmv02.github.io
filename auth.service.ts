import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private port = environment.portURL;

  constructor(private http: HttpClient) {}
  
  login(email: string, password: string) {
    localStorage.clear; //Borro el token antes de hacer el login
    return this.http.post<{token:string}>(`${this.port}/login`,{ email, password });
  }

  register(email: string, username: string, password: string) {
    return this.http.post(`${this.port}/register`, { email, username, password });
  }


  saveToken(token:string):void {
    localStorage.setItem('authJWT',token);
  }

  getToken():string | null {
    return localStorage.getItem('authJWT')
  }
  logout():void{
    localStorage.removeItem('authJWT'); 
    window.location.reload(); // Hago esto para que al hacer logout y quitar el token no se pueda quedar en la pagina
  }
  statusEqualsLogged():boolean{
    const token = this.getToken(); 
    if(token){
      return true;
    }else{
      return false; 
    }
  }}
