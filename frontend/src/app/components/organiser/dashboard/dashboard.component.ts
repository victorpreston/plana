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
    this.renderAnotherChart();
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
          text: 'Number of Tickets'
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

  renderAnotherChart(): void {
    const options = {
      chart: {
        height: 350,
        type: 'line',
      },
      series: [{
        name: 'Revenue',
        data: [10, 41, 35, 51, 49, 62, 69]
      }],
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      },
      yaxis: {
        title: {
          text: 'Revenue'
        }
      }
    };

    const anotherChartElement = document.getElementById('another-chart');
    if (anotherChartElement && typeof ApexCharts !== 'undefined') {
      const anotherChart = new ApexCharts(anotherChartElement, options);
      anotherChart.render();
    }
  }

  initializeCalendar(): void {
    const calendarEl = this.calendarElement.nativeElement;
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      height: 'auto',
      contentHeight: 350
    });
    calendar.render();
  }
}