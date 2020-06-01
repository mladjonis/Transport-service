import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cenovnik-create',
  templateUrl: './cenovnik-create.component.html',
  styleUrls: ['./cenovnik-create.component.css']
})
export class CenovnikCreateComponent implements OnInit {

  createCenovnikFormGroup: FormGroup;
  today: any;
  constructor(public dialogRef: MatDialogRef<CenovnikCreateComponent>,
    private formBuilder: FormBuilder) {

      this.createCenovnikFormGroup = this.formBuilder.group({
        regularna : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(150)])],
        dnevna : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(300)])],
        mesecna : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(3500)])],
        godisnja : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(20000)])]    
      });
    }

  ngOnInit() {
    this.today = new Date().toLocaleString();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
