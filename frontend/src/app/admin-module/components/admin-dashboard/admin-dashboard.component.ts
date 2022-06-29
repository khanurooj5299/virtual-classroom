import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

import { AdminService } from '../../services/admin.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: any = {};
  barChart: any = {};
  displayedColumns: string[] = ['name', 'activeStatus'];
  dataSource?: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private adminService: AdminService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData() {
    this.adminService.getDashboardData().subscribe((res:any)=>{
      if(res.status===200) {
        this.dashboardData = res.data;
        this.dataSource = new MatTableDataSource(res.data.staffDocs);
        this.dataSource.paginator = this.paginator;
        this.setBarChart();
      } else {
        Swal.fire({
          toast: true,
          position: 'top',
          title: res.data,
          timer: 3000,
          showConfirmButton: false,
          icon: 'error'
        });
      }
    });
  }

  setBarChart() {
    const colors: string[] = [
      'rgba(245, 09, 122,  0.4)',
      'rgba(255, 92, 132, 0.4)',
      'rgba(54, 255, 235,  0.4)',
      'rgba(255, 206, 86,  0.4)',
      'rgba(75, 192, 192,  0.4)',
      'rgba(153, 102, 255,  0.4)',
      'rgba(255, 159, 64,  0.4)',
      'rgba(64, 152, 135,  0.4)',
      'rgba(63, 16, 76,  0.4)',
      'rgba(11, 255, 150,  0.4)',
      'rgba(163, 242, 255,  0.4)',
      'rgba(55, 157, 64,  0.4)',
    ];
    this.barChart.type = 'bar';
    this.barChart.data = {
      datasets: [
        {
          label: 'Student registrations for each month',
          data: this.dashboardData.studentBarChartData, 
          borderWidth: 1,
          hoverBackgroundColor: 'black',
          hoverBorderColor: 'black'
        }
      ]
    }
    this.barChart.options = {
      scales: {
        xAxis: {
          grid: {
            display: false
          },
          title: {
            text: 'Months',
            display: true
          }
        },
        yAxis: {
          grid: {
            display: false
          },
          title: {
            text: 'Number of students',
            display: true
          },
          ticks: {
            stepSize: 1
          }
        }
      },
      parsing: {
        xAxisKey: '_id',
        yAxisKey: 'studentCount'
      }
    }
    //--------setting bar colors--------------
    const studentCounts: number[]= []
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    this.dashboardData.studentBarChartData.forEach((element: any)=> {
      studentCounts.push(element.studentCount);
    });
    studentCounts.forEach((element: any) => {
      backgroundColor.push(colors[studentCounts.indexOf(element)]);
      borderColor.push(colors[studentCounts.indexOf(element)]);
    });
    this.barChart.data.datasets[0].backgroundColor = backgroundColor;
    this.barChart.data.datasets[0].borderColor = borderColor;
  }

  onStaffActiveStatusChange(event: MatSlideToggleChange, staffId: string) {
    this.adminService.changeStaffActiveStatus(staffId, event.checked).subscribe((res: any)=>{
      //if status could not be changed slide the toggle back to original state
      if(res.status!==200) {
        event.source.toggle();
      }
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        title: res.data,
        icon: res.status===200?'success':'error'
      });
    });
  }
}
