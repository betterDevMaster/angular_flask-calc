import { Component, Input, OnInit } from '@angular/core';

const SPINNER_CONFIG = {
  
  'ball-spin-fade-rotating': {
    divs: 8,
    class: 'sk-ball-spin-fade-rotating'
  },
  
};

@Component({
  selector: 'app-spinners',
  templateUrl: './spinners.component.html',
  styleUrls: [ './spinners.component.scss']
})
export class SpinnersComponent implements OnInit {
  spinners: any;
  constructor() {}
  @Input() loaderFor: string = 'Loading...';

  /**
   * On init
   */
  ngOnInit() {
    this.spinners = [{
      
        name: this.loaderFor,
        divs: Array(8).fill(1),
        class:'sk-ball-spin-fade-rotating'
      
    }];
}
}