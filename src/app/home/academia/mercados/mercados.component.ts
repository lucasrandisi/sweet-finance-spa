import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mercados',
  templateUrl: './mercados.component.html',
  styleUrls: ['./mercados.component.scss']
})
export class MercadosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
