import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/auth-module/services/auth.service';
import { SetCourseAndSubjectDialogComponent } from 'src/app/staff-module/components/set-question-paper/set-course-and-subject-dialog/set-course-and-subject-dialog.component';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { QuestionPaperService } from 'src/app/shared/services/question-paper.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { Course } from 'src/app/shared/models/course.model';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent implements OnInit {
  student: Student = {};
  subject: Subject = {};
  course: Course = {};
  result: {
    totalQuestions?: number,
    attemptedQuestions?: number,
    correctResponses?: number
  } = {};

  constructor(
    private studentService: StudentService,
    private router: Router,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setCourseAndSubject();
  }

  setCourseAndSubject() {
    const dialogRef : MatDialogRef<SetCourseAndSubjectDialogComponent> = this.dialog.open(SetCourseAndSubjectDialogComponent, {
      minHeight: '300px',
      minWidth: '400px',
      disableClose: true,
      data: {
        mode: 'result-card'
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='error') {
        this.router.navigate(['/student/courses']);
      }
      else {
        this.subject = result.selectedSubject;
        this.course = result.selectedCourse;
        if(this.authService.userIdExists()){
          this.studentService.getResultCard({
            courseId: this.course._id,
            subjectId: this.subject._id,
            year: result.year
          }).subscribe((res: any)=>{
            if(res.status===200) {
              this.student = res.data.studentDetails,
              this.result = res.data.result
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
              this.router.navigate(['/student/courses']);
            }
          });
        }
      }
    });
  }
}
