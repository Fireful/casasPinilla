import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  providers: [NgbCarouselConfig],
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input()
  nombre!: string;
  @Input()
  size!: string;

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {}
}
