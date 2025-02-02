import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  private port = environment.portURL;
    constructor(private http: HttpClient) {}

    deleteAnuncio(id:number){
      return this.http.delete(`${this.port}/delete/ad/${id}`);
    }

    createAnuncio(brand:String,model:String,price:number,kilometros:number, description:String ){
      const token = localStorage.getItem("authJWT");
      console.log("AUTH:",token);
      return this.http.post(`${this.port}/create/ad`,{brand,model,price,kilometros,description},
        {headers:new HttpHeaders({Authorization:`${token}`})});
    }

    getAnuncios(){
      return this.http.get(`${this.port}/ads`); 
    }
}
