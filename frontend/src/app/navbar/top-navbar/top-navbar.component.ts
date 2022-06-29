import { Component, OnDestroy, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/auth-module/services/auth.service';
import { AdminService } from 'src/app/admin-module/services/admin.service'
import { OpenSidenavService } from '../services/open-sidenav.service';
import { Subscription } from 'rxjs';
import { SearchBoxService } from '../services/search-box.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit, OnDestroy{
  isSearchBoxVisible: boolean = false;
  searchValue: string = '';
  requestCount!: number;
  roleId!: number;
  routeNavigateSubscription!: Subscription;
  searchBoxVisibilitySubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private openSidenavService: OpenSidenavService,
    private router: Router,
    private adminService: AdminService,
    private searchBoxService: SearchBoxService
  ) { }

  ngOnInit(): void {
    this.setSearchBoxVisibilitySubscription();
    this.setRoleId();
  }

  setRoleId() {
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
      if(res.status===200) {
        this.roleId = res.data.roleId;
        if(this.roleId==1) {
          this.getRequestCount();
        }
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

  setSearchBoxVisibilitySubscription() {
    /* function used to toggle the visibility of searchbox in topnavbar. Some component will emit the toggleVisibility event along with a boolean
    using the seachBox service
    */
    this.searchBoxVisibilitySubscription = this.searchBoxService.toggleVisibility.subscribe((visibility: boolean)=>{
      this.isSearchBoxVisible = visibility;
    });
  }

  getRequestCount() {
    this.adminService.getRequestCount().subscribe((res: any)=>{
        if(res.status===200) {
        this.requestCount = res.data;
        this.setRouteNavigateSubscription();
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

  setRouteNavigateSubscription() {
    /* if roleId is 1 we need to look out for any route changes so that we can update the request count
    */
    this.routeNavigateSubscription = this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd) {
        this.getRequestCount();
      }
    });
  }

  onToggleSidenav() {
    this.openSidenavService.toggleSidenav.emit();
  }

  onSearchBoxChange() {
    this.searchBoxService.searchValueChanged.emit(this.searchValue);
  }

  onLogout() {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
    }).then((result)=>{
      if(result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  onStaffRegisterRequests() {
    this.router.navigate(['/admin/requests']);
  }

  ngOnDestroy(): void {
    //unsubscribing when topNavbar component is destroyed
    if(this.roleId==1) {
      this.routeNavigateSubscription.unsubscribe();
    }
    this.searchBoxVisibilitySubscription.unsubscribe();
  }
}
