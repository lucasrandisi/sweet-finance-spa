import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-criptos',
  templateUrl: './criptos.component.html',
  styleUrls: ['./criptos.component.scss']
})
export class CriptosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
