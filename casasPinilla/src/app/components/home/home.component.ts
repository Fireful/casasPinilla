import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showNavigationArrows = true;
  showNavigationIndicators = true;
  images = [1055, 194, 368].map(
    (n) => `https://picsum.photos/id/${n}/1500/500`
  );

  public titulo: string;
  constructor() {
    this.titulo = 'Página de inicio';
  }

  ngOnInit(): void {}
}
