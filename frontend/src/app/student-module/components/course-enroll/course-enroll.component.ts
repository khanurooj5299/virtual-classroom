import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-module/services/auth.service';
import { AddressService } from 'src/app/shared/services/address.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import Swal from 'sweetalert2';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-course-enroll',
  templateUrl: './course-enroll.component.html',
  styleUrls: ['./course-enroll.component.scss']
})
export class CourseEnrollComponent implements OnInit {
  @ViewChild('signImg') signImg!: ElementRef;
  @ViewChild('selfImg') selfImg!: ElementRef;
  student: Student = {
    personalDetails: {}, 
    addressDetails: {current: {}, permanent: {}}, 
    academicDetails: {secDetails:{}, senSecDetails:{}, gradDetails:{}}, 
    images: {}
  };
  fileErrors: any = {
    signImgError: '',
    selfImgError: ''
  }
  activeTabIndex = 0;
  countries : any = [];
  currentStates: any = [];
  permanentStates: any = [];
  currentCities: any = [];
  permanentCities: any = [];
  @ViewChild('academicDetailsForm') academicDetailsForm?: NgForm;
  @ViewChild('personalDetailsForm') personalDetailsForm?: NgForm;
  maxDateForAge: Date = new Date();

  constructor(
    private currentRoute: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private addressService: AddressService,
    private authService: AuthService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.setStudentEmail();
    this.student.courseId = this.currentRoute.snapshot.params['courseId'];
    this.student.enrollDate = new Date();
    this.getCountries();
  }

  setStudentEmail() {
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
      if(res.status===200) {
        this.student.email = res.data.email;
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

  getCountries() {
    this.addressService.getCountries().subscribe((res: any)=>{
      if(res.status===200) {
        this.countries = res.data;
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          title: res.data,
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  onCountryChange(eventObj: any) {
    const selectedCountryName = eventObj.value;
    const selectTrigger = eventObj.source.ngControl.name;
   
    const country = this.countries.find((country: any)=>{
      return country.name === selectedCountryName;
    });
    this.addressService.getStates(country._id).subscribe((res: any)=>{
      if(res.status===200) {
        if(selectTrigger==='cCountry') {
          this.currentStates = res.data;
        }
        else {
          this.permanentStates = res.data;
        }
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          title: res.data,
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  onStateChange(eventObj: any) {
    const selectedStateName = eventObj.value;
    const selectTrigger = eventObj.source.ngControl.name;
    let state;
    if(selectTrigger === 'cState') {
      state = this.currentStates.find((state: any)=>{
      return state.name === selectedStateName;
      });
    }
    else {
      state = this.permanentStates.find((state: any)=>{
      return state.name === selectedStateName;
      });
    }
    this.addressService.getCities(state._id).subscribe((res: any)=>{
      if(res.status===200) {
        if(selectTrigger==='cState') {
          this.currentCities = res.data;
        }
        else {
          this.permanentCities = res.data;
        }
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          title: res.data,
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  onDobChange(event: MatDatepickerInputEvent<Date>) {
    this.student.personalDetails!.age = (new Date()).getFullYear() - event.value!.getFullYear();
    this.personalDetailsForm?.form.controls['age'].markAsTouched();
  }

  onSave(index: number) {
    this.activeTabIndex = index;
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      timer: 2000,
      title: 'Data saved',
      showConfirmButton: false
    });
  }

  onPrevious(index: number) {
    this.activeTabIndex = index;
  }

  onAddressCheckBoxChange(eventObj: any) {
    if(eventObj.checked) {
      this.student.addressDetails!.permanent = {...this.student.addressDetails?.current};
      this.permanentStates = this.currentStates;
      this.permanentCities = this.currentCities;
    }
    else {
      this.student.addressDetails!.permanent = {};
      this.permanentStates = [];
      this.permanentCities = [];
    }
  }

  onMarksChange(whichAcademicClass: string) {
    switch(whichAcademicClass) {
      case 'sec': {
        if(this.student.academicDetails?.secDetails?.secMarksObtained && this.student.academicDetails?.secDetails.secMarksTotal) {
          //see if obtained marks is greater than total marks
          if(this.student.academicDetails?.secDetails.secMarksObtained > this.student.academicDetails?.secDetails.secMarksTotal) {
            this.academicDetailsForm?.form.controls['secMarksObtained'].setErrors({'greater':true});
            this.student.academicDetails.secDetails.secPercentage = undefined;
          } else {
            //set percentage
            this.student.academicDetails.secDetails.secPercentage = parseFloat(((this.student.academicDetails?.secDetails?.secMarksObtained / this.student.academicDetails.secDetails.secMarksTotal) * 100).toFixed(2));
          }
        }
        break;
      }
      case 'senSec' : {
        if(this.student.academicDetails?.senSecDetails?.senSecMarksObtained && this.student.academicDetails.senSecDetails.senSecMarksTotal) {
          if(this.student.academicDetails?.senSecDetails.senSecMarksObtained > this.student.academicDetails?.senSecDetails.senSecMarksTotal) {
            this.academicDetailsForm?.form.controls['senSecMarksObtained'].setErrors({'greater':true});
            this.student.academicDetails.senSecDetails.senSecPercentage = undefined;
          } else {
            this.student.academicDetails.senSecDetails.senSecPercentage = parseFloat(((this.student.academicDetails.senSecDetails?.senSecMarksObtained / this.student.academicDetails.senSecDetails.senSecMarksTotal) * 100).toFixed(2));
          }
        }
        break;
      }
      case 'grad' : {
        if(this.student.academicDetails?.gradDetails?.gradMarksObtained && this.student.academicDetails.gradDetails.gradMarksTotal) {
          if(this.student.academicDetails?.gradDetails.gradMarksObtained > this.student.academicDetails?.gradDetails.gradMarksTotal) {
            this.academicDetailsForm?.form.controls['gradMarksObtained'].setErrors({'greater':true});
            this.student.academicDetails.gradDetails.gradPercentage = undefined;
          } else {
            this.student.academicDetails.gradDetails.gradPercentage = parseFloat(((this.student.academicDetails.gradDetails?.gradMarksObtained / this.student.academicDetails.gradDetails.gradMarksTotal) * 100).toFixed(2));
          }
        }
        break;
      }
    }
  }

  onFileInput(eventObj: any) {
        let allowedExt = /(\jpg|\jpeg|\png)$/i;
        let allowedFileSize = 50 *1000 ; //in bytes
        const imgFile = eventObj.target.files[0];
        
        if(imgFile) {
            let extension = imgFile.type.replace(/(.*)\//g, '');
            if(extension.match(allowedExt)) {
                let size = imgFile.size; //returned size is in bytes
                if(size <= allowedFileSize) {
                    if(eventObj.target.name==='signImg') {
                      this.fileErrors.signImgError = '';
                    } else {
                      this.fileErrors.selfImgError = '';
                    }
                    const reader = new FileReader();
                    reader.onload = ()=>{
                        if(eventObj.target.name==='signImg') {
                          this.student.images!.signImg = reader.result;
                        }
                        else {
                          this.student.images!.selfImg = reader.result;
                        }
                    };
                    reader.readAsDataURL(imgFile);
                }
                else {
                    let error = `File too large. Allowed file size is ${allowedFileSize/1000}KB`;
                    if(eventObj.target.name==='signImg') {  //needed because a user might reselect a invalid file
                      this.fileErrors.signImgError = error;
                      this.student.images!.signImg = '';
                      this.signImg.nativeElement.value = '';
                    }
                    else {
                      this.fileErrors.selfImgError = error;
                      this.student.images!.selfImg = '';
                      this.selfImg.nativeElement.value = '';
                    }
                }
                
            }
            else {
                let error = 'File type not supported';
                if(eventObj.target.name==='signImg') {  //needed because a user might reselect a invalid file
                  this.fileErrors.signImgError = error;
                  this.student.images!.signImg = '';
                  this.signImg.nativeElement.value = '';
                }
                else {
                  this.fileErrors.selfImgError = error;
                  this.student.images!.selfImg = '';
                  this.selfImg.nativeElement.value = '';
                }
            }
        }
        else { //this is required because if user opens the dialog and clicks cancel..then no file is chosen
            if(eventObj.target.name==='signImg') {
              this.fileErrors.signImgError = '';
              this.student.images!.signImg = '';
            }
            else {
              this.fileErrors.selfImgError = '';
              this.student.images!.selfImg = '';
            }
        }
    }

  onEnroll() {
    this.studentService.courseEnroll(this.student).subscribe((res: any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        icon: res.status===200?'success':'error',
        title: res.data,
        timer: 3000,
        showConfirmButton: false
      });
    if(res.status===200 || res.status===400) { //in all other cases we let the user try again
      this.router.navigate(['/student', this.student.courseId, 'course-details']);
    }
    });
  }

  onBack() {
    this.router.navigate(['/student', this.student.courseId, 'course-details'], {
      queryParamsHandling: 'preserve'
    });
  }
}
