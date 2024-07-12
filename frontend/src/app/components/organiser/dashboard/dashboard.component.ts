import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('calendar') calendarElement!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.renderChart();
    this.initializeCalendar();
  }

  renderChart(): void {
    const options = {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [{
        name: 'Leads',
        data: [44, 55, 57, 56, 61, 58, 63]
      }],
      xaxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      yaxis: {
        title: {
          text: 'Number of Leads'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + " leads"
          }
        }
      }
    };

    const chartElement = document.getElementById('column-chart');
    if (chartElement && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  }

  initializeCalendar(): void {
    const calendarEl = this.calendarElement.nativeElement;
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      height: 'auto', // Ensure the calendar height is adjusted to its content
      contentHeight: 350 // Adjust this value as needed
    });
    calendar.render();
  }
}