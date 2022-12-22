import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm.message',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

    public confirm : EventEmitter<void> = new EventEmitter<void>();
    public reject  : EventEmitter<void> = new EventEmitter<void>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {message: string},
        public dialogRef: MatDialogRef<ConfirmComponent>,  
    ) { }

    ngOnInit(): void {
    }

    clickConfirm() {
        this.dialogRef.close();
        this.confirm.emit();
    }

    clickReject() {
        this.dialogRef.close();
        this.reject.emit();
        
    }


}
