import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth-module/services/auth.service';
import { StudentService } from '../../services/student.service';
import { GetInputsComponent } from './get-inputs/get-inputs.component';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  certificate!: any;
  errorMssg!: string;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCertificate();
  }

  getCertificate() {
    let dialogRef = this.dialog.open(GetInputsComponent, {
      height: '70vh',
      width: '40em'
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result=='error') {
        this.router.navigate(['/student/courses']);
      } else {
        if(result.status==200) {
          this.certificate = result.data;
        } else {
          this.errorMssg = result.data;
        }
      }
    });
  }

}
