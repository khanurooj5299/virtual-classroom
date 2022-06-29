import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Subject } from 'src/app/shared/models/subject.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { AddSubjectDialogComponent } from './add-subject-dialog/add-subject-dialog.component';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { AddContentDialogComponent } from './add-content-dialog/add-content-dialog.component';
import { EditContentDialogComponent } from './edit-content-dialog/edit-content-dialog.component';
// import { Subscription } from 'rxjs';
import { User } from 'src/app/auth-module/models/user.model';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit, OnDestroy{
  courseId: string = '';
  subjects: Subject[] = [];
  displayedColumns: string[] = ['name', 'description', 'requirements', 'instructor', 'actions'];
  roleId!: any;
  dataSource!: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private courseService: CourseService,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private subjectSevice: SubjectService,
    private dialog: MatDialog,
    private authService: AuthService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.setRoleId();
    this.courseId = this.currentRoute.snapshot.params['courseId'];
    this.getSubjects();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setRoleId() {
    const userId = <string>localStorage.getItem('loggedInUserId');
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
      if(res.status===200) {
        const user: User = res.data;
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

  getSubjects() {
    this.courseService.getCourseSubjectsForSubjectsComponent(this.courseId).subscribe((res: any)=>{
      if (res.status === 200) {
        this.subjects = res.data;
        this.dataSource = new MatTableDataSource(this.subjects);
        this.dataSource.paginator = this.paginator;
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          showConfirmButton: false,
          title: res.data,
          timer: 3000
        });
      }
    });
  }

  onAddSubject() {
    const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
      maxWidth: '600px',
      data: {
        courseId: this.courseId
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='success') {
        this.getSubjects();
      }
    });
  }

  onEditSubject(subject: Subject) {
    const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
      maxWidth: '600px',
      data: {
        editMode: true,
        subject: {...subject}
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='success') {
        this.getSubjects();
      }
    });
  }

  onRemoveSubject(subjectId: string) {
    Swal.fire({
      title: 'Delete Subject?',
      icon: 'warning',
      showCancelButton: true,
    }).then((result)=>{
      if(result.isConfirmed) {
        this.subjectSevice.removeSubject(subjectId).subscribe((res: any)=>{
        if(res.status === 200) {
          this.getSubjects();
        }
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          title: res.data,
          timer: 3000,
          icon: res.status===200?'success':'error'
        });
        });
      }
    });
  }

  onAddContent(subjectId: string) {
        this.dialog.open(AddContentDialogComponent, {
        height: '400px',
        width: '400px',
        data: {
          subjectId: subjectId
        }
      });
  }

  onEditContent(subjectId: string) {
    let editContentDialogRef = this.dialog.open(EditContentDialogComponent, {
        height: '400px',
        width: '400px',
        data: {
          mode: 'edit',
          subjectId: subjectId
        }
      });
  }

  onBack() {
    this.router.navigate(['/course/courses']);
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }
}
