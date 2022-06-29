import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { LoaderService } from 'src/app/shared/services/loader.service';
import { AuthService } from 'src/app/auth-module/services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  passwords: {oldPass?: string, newPass?: string, cNewPass?: string} = {};

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
  }

  onPassSubmit() {
    if(this.passwords.newPass === this.passwords.cNewPass) {
      if(this.authService.userIdExists()) {
        this.authService.changePassword(this.passwords).subscribe((res: any)=>{
          if(res.status===200 || res.status===403) {
            this.dialogRef.close();
          }
          Swal.fire({
            toast: true,
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            title: res.data,
            icon: res.status===200?'success':'error'
          });
      });
      }
    }
    else {
      Swal.fire({
      toast: true,
      position: 'top',
      title: 'Passwords don\'t match',
      icon: 'error',
      timer: 3000,
      showConfirmButton: false
      });
    }
  }
}
