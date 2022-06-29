import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { RollNumberSlipDialogComponent } from './roll-number-slip-dialog/roll-number-slip-dialog.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-admit-card',
  templateUrl: './admit-card.component.html',
  styleUrls: ['./admit-card.component.scss']
})
export class AdmitCardComponent implements OnInit {
  courses: Course[] = [];
  displayedColumns: string[] = ['courses', 'actions'];
  dataSource?: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private courseService: CourseService,
    private matDialog: MatDialog,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCourses() {
    this.courseService.getCoursesForAdmitCardComponent().subscribe((res: any) => {
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

  onDownload(course: Course) {
    this.matDialog.open(RollNumberSlipDialogComponent, {
      height: '600px',
      width: '600px',
      data: {
        course: course
      }
    });
  }

}
