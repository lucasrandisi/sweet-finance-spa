import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hiseconomica',
  templateUrl: './hiseconomica.component.html',
  styleUrls: ['./hiseconomica.component.scss']
})
export class HiseconomicaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
