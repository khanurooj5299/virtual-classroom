import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  staffRegisterRequests: Request[] = [];
  dataSource!: MatTableDataSource<Request>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['image', 'name', 'actions'];
  //this array contains al userIds for which checkbox is checked
  requestsToHandle: string[] = []; 

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests() {
    this.adminService.getRequests().subscribe((res: any)=>{ //each request has _id(userId) name and image
      if(res.status==200) {
        this.staffRegisterRequests = res.data;
        this.dataSource = res.data;
        this.dataSource.paginator = this.paginator;
      } else {
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          title: res.data,
          timer: 3000,
          icon: 'error'
        });
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onHandleRequest(requestId: string, isApproved: boolean) {
    /*if any of the checkboxes is checked, it means requestsToHandle array has a length. In this case only the array requests are handled
    regardless of which requests approve or decline button was clicked*/
    if(this.requestsToHandle.length==0) {
      this.requestsToHandle.push(requestId);
    }
    this.adminService.handleRequests(this.requestsToHandle, isApproved).subscribe((res: any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        title: res.data,
        timer: 3000,
        icon: res.status==200?'success':'error'
      });
      if(res.status===200) {
        this.getRequests();
      }
    });
  }

  onCheckboxChange(event: any, requestId: string) {
    if(event.checked) {
      //checkbox is checked so adding request to array
      this.requestsToHandle.push(requestId);
    } else {
      //checkbox was unchecked and now we need to remove this userId(requestId) from requestsToHandle array
      //finding the index
      const position = this.requestsToHandle.indexOf(requestId);
      //deleting
      this.requestsToHandle.splice(position, 1);
    }
  }
}
