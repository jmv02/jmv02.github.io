import { HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()

export class Interceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('authJWT'); 
    if(authToken){
      req = req.clone({
        headers:req.headers.set(
          'Authorization',`${localStorage.getItem('authJWT')}`)}); 
    }
    return next.handle(req); 
    }
}