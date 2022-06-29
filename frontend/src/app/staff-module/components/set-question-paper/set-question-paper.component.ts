import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SetCourseAndSubjectDialogComponent } from './set-course-and-subject-dialog/set-course-and-subject-dialog.component';
import { QuestionPaper } from '../../../shared/models/question-paper.model';
import { Question } from '../../../shared/models/question.model';
import { NgForm } from '@angular/forms';
import { QuestionPaperService } from '../../../shared/services/question-paper.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-set-question-paper',
  templateUrl: './set-question-paper.component.html',
  styleUrls: ['./set-question-paper.component.scss']
})
export class SetQuestionPaperComponent implements OnInit {
  @ViewChild('quesForm') quesForm!: NgForm;
  numOfQuestions: number = 5;
  addedQuestions: number = 0;
  questionPaper: QuestionPaper = {questions: []};
  question: Question = {options: []};
  correctOptionExists: boolean = false;

  constructor(
    private dialog: MatDialog,
    private questionPaperService: QuestionPaperService,
    private router: Router,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.setCourseAndSubjectId();
  }

  setCourseAndSubjectId() {
    const dialogRef: MatDialogRef<SetCourseAndSubjectDialogComponent> = this.dialog.open(SetCourseAndSubjectDialogComponent, {
      height: '300px',
      width: '400px',
      disableClose: true,
      data: {
        mode: 'set-question-paper'
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='error') {
        this.router.navigate(['/course/courses']);
      }
      else {
        this.questionPaper.subjectId = result.selectedSubject._id;
        this.questionPaper.courseId = result.selectedCourse._id;
        this.questionPaper.year = (new Date()).getFullYear();
        this.questionPaperExists();
      }
    });
  }

  questionPaperExists() {
    this.questionPaperService.questionPaperExists(
      {
        year: this.questionPaper.year,
        courseId: this.questionPaper.courseId,
        subjectId: this.questionPaper.subjectId
      }
    ).subscribe((res: any)=>{
      if(res.status!==200) {
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          icon: 'error',
          title: res.data.mssg
        });
        this.router.navigate(['/course/courses']);
      }
    });
  }

  onSaveAndNext() {
    this.addedQuestions++;
    this.questionPaper.questions?.push(this.question);
    this.question = {options: []};
    this.correctOptionExists = false;
    this.quesForm.resetForm();
  }

  onSubmit() {
    this.questionPaper.questions?.push(this.question);
    this.questionPaperService.setQuestionPaper(this.questionPaper).subscribe((res: any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
        title: res.data,
        icon: res.status===200?'success':'error'
      });
      this.router.navigate(['/course/courses']);
    });
  }

  onCorrectOptionChange() {
    this.correctOptionExists = this.question.options.includes(this.question.correctOption);
  }
}
