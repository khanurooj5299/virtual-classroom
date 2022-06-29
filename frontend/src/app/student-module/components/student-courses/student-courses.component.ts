import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SearchBoxService } from 'src/app/navbar/services/search-box.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.scss']
})
export class StudentCoursesComponent implements OnInit, OnDestroy {
  searchValue = '';
  courses: Course[] = [];
  searchBoxChangeSubscription!: Subscription;

  constructor(
    private courseService: CourseService,
    private router: Router,
    public loaderService: LoaderService,
    private searchBoxService: SearchBoxService
  ) { }

  ngOnInit(): void {
    // we need to inform topnavbar to show the searchbox
    this.searchBoxService.toggleVisibility.emit(true);
    //we need to subscribe to searchboxChange event to get the latest value in searchbox
    this.setSearchBoxChangeSubscription();
    this.getCourses();
  }

  getCourses() {
    this.courseService.getCoursesForStudentCoursesComponent().subscribe((res: any)=>{
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
      }
    });
  }

  searchCourses(searchValue: string) {
    this.courseService.searchCourses(searchValue).subscribe((res: any)=>{
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
      }
    });
  }

  setSearchBoxChangeSubscription() {
    this.searchBoxChangeSubscription = this.searchBoxService.searchValueChanged.subscribe((searchValue: string)=>{
      if(searchValue.trimStart().length > 0) {
        this.searchCourses(searchValue);
      }
      else {
        this.getCourses();
      }
    });
  }

  onViewCourse(courseId: string|undefined) {
    this.router.navigate(['/student', courseId, 'course-details'], {
      queryParams: {
        action: "student/courses"
      }
    });
  }

  ngOnDestroy(): void {
    //we need to inform topnavbar to hide the searchbox
    this.searchBoxService.toggleVisibility.emit(false);
    //we need to stop listening to searchBox change event
    this.searchBoxChangeSubscription.unsubscribe();
  }
}
