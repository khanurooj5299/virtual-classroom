import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AddCourseDialogComponent } from './add-course-dialog/add-course-dialog.component';
import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { User } from 'src/app/auth-module/models/user.model';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit{
  courses: Course[] = [];
  displayedColumns: string[] = ['code', 'name', 'duration', 'credits', 'actions'];
  roleId!: any;
  dataSource?: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.setRoleId();
    this.getCourses();
  }

  setRoleId() {
    if(this.authService.userIdExists()){
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

  getCourses() {
    this.courseService.getCoursesForCoursesComponent().subscribe((res: any) => {
      if (res.status === 200) {
        this.courses = res.data;
        this.dataSource = new MatTableDataSource(this.courses);
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

  onAddCourse() {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      maxWidth: '600px',
      data: {
        editMode: false
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='success'){
        this.getCourses();
      }
    });
  }

  onSubjects(courseId: string) {
    this.router.navigate(['/course', courseId, 'subjects']);
  }

  onEditCourse(course: Course) {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      maxWidth: '600px',
      data: {
        editMode: true,
        course: {...course}
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='success'){
        this.getCourses();
      }
    });
  }

  onViewCourse(courseId: string|undefined) {
    this.router.navigate(['/student', courseId, 'course-details'], {
      queryParams: {
        action: "course/courses"
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource)
  }
}
