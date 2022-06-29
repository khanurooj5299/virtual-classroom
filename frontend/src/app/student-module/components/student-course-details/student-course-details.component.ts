import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
// import { Location } from '@angular/common';

import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { StudentService } from '../../services/student.service';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubjectContent } from 'src/app/shared/models/subject-content.model';
import { EditContentDialogComponent } from 'src/app/shared/components/subjects/edit-content-dialog/edit-content-dialog.component';

@Component({
  selector: 'app-student-course-details',
  templateUrl: './student-course-details.component.html',
  styleUrls: ['./student-course-details.component.scss']
})
export class StudentCourseDetailsComponent implements OnInit {
  courseId: string = "";
  course: Course = {};
  isEnrolled!: boolean;
  enrolledCourseId!: string;

  constructor(
    private courseService: CourseService,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService,
    public loaderService: LoaderService,
    private dialog: MatDialog,
    // private location: Location,
  ) { }

  ngOnInit(): void {
    this.courseId = this.currentRoute.snapshot.params['courseId'];
    this.getCourseAndSubjects();
  }
  
  getCourseAndSubjects() {
    this.courseService.getCourseAndSubjects(this.courseId).subscribe((res: any) => {
      if (res.status === 200) {
        this.course = res.data; //this course document has an extra field named subjects which is an array of docs
        this.setIsEnrolled();
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          title: res.data,
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
        this.router.navigate(['/student/courses']);
      }
    });
  }

  setIsEnrolled() {
    if(this.authService.userIdExists()) {
      this.studentService.isEnrolled().subscribe((res: any)=>{
        if(res.status===200) {
          this.isEnrolled = res.data.isEnrolled; //res.data is true or false
          this.enrolledCourseId = res.data.enrolledCourseId;
        } else {
          Swal.fire({
            toast: true,
            position: 'top',
            title: res.data,
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
          });
          this.router.navigate(['/student/courses']);
        }
      });
    }
  }

  onCourseEnroll() {
    if(this.isEnrolled) {
      Swal.fire({
        toast: true,
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
        title: 'You have already enrolled for a course',
        icon: 'error'
      });
    } else {
      this.router.navigate(['/student', this.courseId, 'course-enroll'], {
        queryParamsHandling: 'preserve'
      });
    }
  }

  onBack() {
    // this.router.navigate(['/student/courses']);
    // this.location.back();
    this.currentRoute.queryParams.subscribe(params => {
      const action = params['action'];
      this.router.navigate([action]);
    });
  }

  onDownloadContent(content: SubjectContent[]) {
    this.dialog.open(EditContentDialogComponent, {
      height: '70vh',
      width: '40em',
      data: {
        mode: 'download',
        content: content
      }
    });
  }
}
