import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';

import { AuthService } from 'src/app/auth-module/services/auth.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { QuestionPaperService } from 'src/app/shared/services/question-paper.service';
import { SetCourseAndSubjectDialogComponent } from 'src/app/staff-module/components/set-question-paper/set-course-and-subject-dialog/set-course-and-subject-dialog.component';
import { Question } from 'src/app/shared/models/question.model';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { AnswerPaper } from 'src/app/shared/models/answer-paper.model';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-give-exam',
  templateUrl: './give-exam.component.html',
  styleUrls: ['./give-exam.component.scss']
})
export class GiveExamComponent implements OnInit {
  student: Student = {};
  subject: Subject = {};
  numOfQuestions: number = 5;
  attemptedQuestions: number = 0;
  question: Question = {};
  response: {
    questionId?: string,
    response?: string
  } = {};
  answerPaper: AnswerPaper = {responses: []};
  @ViewChild('cd', { static: false }) private countdown: any;
  countDownConfig: CountdownConfig = {
    leftTime: 100,
    format: 'm:s',
    demand: true
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private questionPaperService: QuestionPaperService,
    public loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.setStudent();
  }

  setStudent() {
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
      if(res.status===200) {
        this.studentService.getStudent(res.data.email).subscribe((res: any)=>{
          if(res.status===200) {
            this.student = res.data;
            this.answerPaper.studentId = this.student._id;
            this.setCourseAndSubject();
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
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          title: res.data,
          timer: 3000,
          showConfirmButton: false
        });
        if(res.status===400) {
          this.router.navigate(['/student/courses']);
        }
        else {
          this.router.navigate(['/user']);
        }
      }
    });
    }
  }

  setCourseAndSubject() {
    const dialogRef : MatDialogRef<SetCourseAndSubjectDialogComponent> = this.dialog.open(SetCourseAndSubjectDialogComponent, {
      minHeight: '300px',
      minWidth: '400px',
      disableClose: true,
      data: {
        mode: 'give-exam',
        courseId: this.student.courseId,
        rollNo: this.student._id
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='error') {
        this.router.navigate(['/student/courses']);
      }
      else {
        this.subject = result.selectedSubject;
        this.questionPaperExists();
      }
    });
  }

  questionPaperExists() {
    this.questionPaperService.questionPaperExists(
      {
        courseId: this.student.courseId,
        subjectId: this.subject._id,
        year: (new Date()).getFullYear()
      }
    ).subscribe((res: any)=>{
      if(res.status===400) {
        this.answerPaper.questionPaperId = res.data.questionPaperId;
        this.answerPaperExists();
        this.setQuestion();
        this.countdown.begin();
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          title: res.data.mssg,
          timer: 3000,
          showConfirmButton: false
        });
        this.router.navigate(['/student/courses']);
      }
    });
  }

  answerPaperExists() {
    this.questionPaperService.answerPaperExists(
      {
        studentId: this.student._id,
        questionPaperId: this.answerPaper.questionPaperId
      }
    ).subscribe((res: any)=>{
      if(res.status===200) {
        this.setQuestion();
        this.countdown.begin();
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

  setQuestion() {
    //using this.answerPaper.questionPaperId get each question
    this.questionPaperService.getQuestion(this.answerPaper.questionPaperId, this.attemptedQuestions).subscribe((res: any)=>{
      if(res.status===200) {
        this.question = res.data;
      }
      else {
        Swal.fire({
        toast: true,
        position: 'top',
        icon: res.status===200?'success':'error',
        title: res.data,
        timer: 3000,
        showConfirmButton: false
        });
        this.router.navigate(['/student/courses']);
      }
    });
  }

  onSaveAndNext() {
    this.attemptedQuestions++;
    this.response.questionId = this.question._id;
    this.answerPaper.responses?.push(this.response);
    this.response = {};
    this.setQuestion();
  }

  onSubmit() {
    this.response.questionId = this.question._id;
    this.answerPaper.responses?.push(this.response);
    this.answerPaper.subjectName = this.subject.name;
    this.questionPaperService.addAnswerPaper(this.answerPaper).subscribe((res: any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        icon: res.status===200?'success':'error',
        title: res.data,
        timer: 3000,
        showConfirmButton: false
      });
      this.router.navigate(['/student/courses']);
    });
  }

  handleCountDown(event: CountdownEvent) {
    if(event.action==='done') {
      this.questionPaperService.addAnswerPaper(this.answerPaper).subscribe((res: any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        icon: res.status===200?'success':'error',
        title: res.status===200?'Time up! Answer paper submitted':res.data,
        timer: 3000,
        showConfirmButton: false
      });
      this.router.navigate(['/student/courses']);
    });
    }
  }
}