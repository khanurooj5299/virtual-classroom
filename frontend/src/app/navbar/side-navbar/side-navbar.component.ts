import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { User } from 'src/app/auth-module/models/user.model';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { OpenSidenavService } from '../services/open-sidenav.service';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  openSidenav: boolean = false;
  initials: string = "";
  roleId!: any;

  constructor(
    private openSidenavService: OpenSidenavService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.setInitialsandRoleId();
    this.openSidenavService.toggleSidenav.subscribe(()=>{
      this.openSidenav = !this.openSidenav;
    });
  }

  setInitialsandRoleId() {
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
      if(res.status===200) {
        const user: User = res.data;
        this.initials = (user.name!.split(' ')[0].charAt(0) + user.name!.split(' ')[1].charAt(0)).toUpperCase();
        this.roleId = user.roleId;
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          title: res.data,
          timer: 3000,
          showConfirmButton: false
        });
        this.router.navigate(['/user']);
      }
    });
    }
  }

  onChangePassword() {
    this.dialog.open(ChangePasswordDialogComponent);
  }

  onEditUser() {
    this.router.navigate(['/user/register'],{
      queryParams: {
        editMode: true
      }
    });
  }
}
