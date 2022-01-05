import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-anatecnico',
  templateUrl: './anatecnico.component.html',
  styleUrls: ['./anatecnico.component.scss']
})
export class AnatecnicoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
