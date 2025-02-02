import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AnunciosService } from '../anuncios-service/anuncios.service';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrl: './anuncios.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AnunciosComponent implements OnInit {
  title = 'Venta Vehiculos Nebrija';
  _anuncios: any[] = [];
  display: boolean = false;
  showDialog() {
    this.display = true;
  }
  constructor(private authService: AuthService, private router: Router, private anuncios: AnunciosService) { }

  anunciosForm = new FormGroup({
    marca: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
    modelo: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
    price: new FormControl("", [Validators.required]),
    kilometros: new FormControl("", [Validators.required]),
    descripcion: new FormControl("", [Validators.required])
  });

  ngOnInit(): any {
    const ads = this.anuncios.getAnuncios().subscribe((_anuncios: any) => {
      this._anuncios = _anuncios;
    });

  }


  createAnuncio(): void {

    if (this.anunciosForm.valid) {
      const { marca, modelo, price, kilometros, descripcion } = this.anunciosForm.value;
      console.log("Tipos de datos:", {
        marca: typeof marca,
        modelo: typeof modelo,
        price: typeof price,
        kilometros: typeof kilometros,
        descripcion: typeof descripcion,
      });

      if (typeof marca === "string" && typeof modelo === "string" && typeof price === "number"
        && typeof kilometros === "number" && typeof descripcion === "string") {

        this.anuncios.createAnuncio(marca, modelo, price, kilometros, descripcion).subscribe(() => {
          window.location.reload();
        });
      } else {
        console.error("No se esta podiendo crear el anuncio");
      }
    }
  }
  deleteAnuncio(id: number): void {
    this.anuncios.deleteAnuncio(id).subscribe(() => {
      window.location.reload();
    })
  }
}
