import { Component, OnInit } from '@angular/core';
import { AnunciosService } from '../anuncios-service/anuncios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  constructor( private anuncios:AnunciosService){}

  ngOnInit(): void {
    this.anuncios.getAnuncios(); 
  }

}
