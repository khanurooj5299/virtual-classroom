import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Course } from 'src/app/shared/models/course.model';
import { Subject } from 'src/app/shared/models/subject.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-set-course-and-subject-dialog',
  templateUrl: './set-course-and-subject-dialog.component.html',
  styleUrls: ['./set-course-and-subject-dialog.component.scss']
})
export class SetCourseAndSubjectDialogComponent implements OnInit {
  courses: Course[] = [];
  subjects: Subject[] = [];
  result: {
    selectedCourse?: any,
    selectedSubject?: any,
    year?: any
  } = {
    selectedCourse: {},
    selectedSubject: {}
  };
  mode: string = '';
  rollNo: string = '';

  constructor(
    private courseService: CourseService,
    private dialogRef: MatDialogRef<SetCourseAndSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.setMode();
    if(this.mode=='set-question-paper' || this.mode=='result-card'){
      this.getCourses();
    } else if (this.mode =='give-exam') {
      this.getCourseAndSubjects();
    }
  }

  setMode() {
    this.mode = this.dialogData.mode;
  }

  getCourseAndSubjects() {
    this.courseService.getCourseAndSubjects(this.dialogData.courseId).subscribe((res: any)=>{
      if(res.status===200) {
        this.result.selectedCourse = res.data;
        this.courses[0] = res.data;
        this.subjects = res.data.subjects;
      } else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          showConfirmButton: false,
          title: res.data,
          timer: 3000
        });
        this.dialogRef.close('error');
      }
    });
  }

  getCourses() {
    this.courseService.getCourses().subscribe((res: any) => {
      if (res.status === 200) {
        this.courses = res.data;
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
        this.dialogRef.close('error');
      }
    });
  }

  onCourseChange() {
    this.courseService.getCourseSubjects(this.result.selectedCourse._id).subscribe((res: any)=>{
      if(res.status===200) {
        this.subjects = res.data;
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          icon: 'error',
          title: res.data
        });
        this.dialogRef.close('error');
      }
    });
  }

  onProceed() {
    if(this.mode==='give-exam'){
      if(this.rollNo !== this.dialogData.rollNo) {
        Swal.fire({
          toast: true,
          title: 'Incorrect Roll number',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          icon: 'error'
        });
      }
      else {
        this.dialogRef.close(this.result);
      }
    }
    else {//mode is set-question-paper or result-card
      this.dialogRef.close(this.result);
    }
  }
}
