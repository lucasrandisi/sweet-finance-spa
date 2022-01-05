import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-varmacroeconomicas',
  templateUrl: './varmacroeconomicas.component.html',
  styleUrls: ['./varmacroeconomicas.component.scss']
})
export class VarmacroeconomicasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
