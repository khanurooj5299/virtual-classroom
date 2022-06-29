import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';

import { SubjectContent } from 'src/app/shared/models/subject-content.model';
import { SubjectService } from '../../../services/subject.service';
import { User } from 'src/app/auth-module/models/user.model';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-edit-content-dialog',
  templateUrl: './edit-content-dialog.component.html',
  styleUrls: ['./edit-content-dialog.component.scss']
})
export class EditContentDialogComponent implements OnInit {
  mode!: string; //mode can be edit(from shared-module/subjects) or download(from student-module/student-course-details)
  content: SubjectContent[] = [];
  loggedInUser: User = {};
  subjectId: string = '';
  displayedColumns: string[] = ['fileName', 'actions'];
  dataSource?: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private subjectService: SubjectService,
    private authService: AuthService,
    private router: Router,
    public loaderService: LoaderService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.mode = this.dialogData.mode;
    if(this.mode=='edit') {
      this.subjectId = this.dialogData.subjectId;
      this.setLoggedInUser();
    } else {
      //mode is download
      this.content = this.dialogData.content;
      this.dataSource = new MatTableDataSource(this.content);
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setLoggedInUser() {
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
        if(res.status===200) {
          this.loggedInUser = res.data;
          this.getSubjectContent();
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

  getSubjectContent() {
    this.subjectService.getSubjectContentForAdmitCardComponent(this.subjectId, this.loggedInUser._id).subscribe((res: any)=>{
      if(res.status === 200) {
        this.content = res.data;
        this.dataSource = new MatTableDataSource(this.content);
        this.dataSource.paginator = this.paginator;
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          title: res.data,
          showConfirmButton: false,
          icon: 'error',
          timer: 3000
        });
      }
    });
  }

  onRemove(fileId: string) {
    this.subjectService.removeSubjectContent(this.subjectId, fileId).subscribe((res: any)=>{
      if(res.status===200) {
        this.getSubjectContent();
      }
      Swal.fire({
        toast: true,
        position: 'top',
        title: res.data,
        showConfirmButton: false,
        icon: res.status===200?'success':'error',
        timer: 3000
      });
    });
  }
}
