import { DomService } from './../../dom.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'my-component',
  template: `
  <div>
</div>
  `,
})
export class MyComponent {
  onDrop(data: any) {
    alert(`dropped: ${data}`);
  }
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.sass']
})
export class SchedulerComponent implements OnInit {

  currentDate: moment.Moment;
  weekStart;
  weekEnd;
  days;
  displayedWeek;
  weekDays;
  d = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Tuesday', 'Friday', 'Saturday'];
  currentYear;
  currentMonth;
  currentStartDay;
  currentEndDay;
  hours = [];
  selectedDay;
  selectedHour;
  showDraggableElem;
  formGroup: FormGroup;
  schHour;

  constructor(private domService: DomService, private formBuilder: FormBuilder) {
    this.currentDate = moment();
    this.weekDays = this.getWeekDays(this.currentDate);
    this.displayHeaderData(this.weekDays[0]);
    this.currentStartDay = moment(this.weekDays[0]).format('MMMM DD');
    this.currentEndDay = moment(this.weekDays[6]).format('MMMM DD');
    this.hours = this.iterateThroughHours();
    console.log(this.hours);

    this.formGroup = this.formBuilder.group({
      schHour: ['']
    });
    this.formGroup.valueChanges.subscribe((e) => {
      this.schHour = e.schHour;
      console.log('vaaaa', this.schHour);
    });
  }

  addToBody() {
    // this.domService.appendComponentToBody(MyComponent);
  }

  onDrop(data: any) {
    console.log(data);
    if (Object.keys(data.data).length > 0) {
      data.target.innerHTML = data.data;
    }
    // alert(`dropped: ${data}`);
  }

  nextWeek(dt) {
    this.weekDays = this.getWeekDays(moment(dt).add(1, 'days'));
    this.displayHeaderData(this.weekDays[0]);
    this.currentStartDay = moment(this.weekDays[0]).format('MMMM DD');
    this.currentEndDay = moment(this.weekDays[6]).format('MMMM DD');
  }

  iterateThroughHours() {
    const hours = [];
    for (let i = 1; i <= 24; i++) {
      hours.push({hour: i});
    }
    return hours;
  }

  previousWeek(dt) {
    this.weekDays = this.getWeekDays(moment(dt).subtract(1, 'days'));
    this.displayHeaderData(this.weekDays[0]);
    this.currentStartDay = moment(this.weekDays[0]).format('MMMM DD');
    this.currentEndDay = moment(this.weekDays[6]).format('MMMM DD');
  }

  displayHeaderData(data) {
    this.currentYear = moment(data).format('YYYY');
    this.currentMonth = moment(data).format('MMMM');
  }

  getWeekDays(currentDate) {
    this.weekStart = currentDate.clone().startOf('week');
    this.weekEnd = currentDate.clone().endOf('week');

    this.days = [];
    this.displayedWeek = [];
    for (let i = 0; i <= this.d.length - 1; i++) {
      this.days.push(moment(this.weekStart).add(i, 'days'));
      // this.displayedWeek.push({
      //   day: moment(this.weekStart).add(i, 'days').format('dddd'),
      //   month: moment(this.weekStart).add(i, 'days').format('MMMM'),
      //   year: moment(this.weekStart).add(i, 'days').format('YYYY')
      // });
      // console.log(this.displayedWeek);
      // console.log(this.days);
    }
    return this.days;
  }

  getDay(day) {
    this.selectedDay = day;
    // console.log('getDay', day);
  }

  getHour(hour, day, event) {
    const date = moment(day);
    const time = moment(hour.hour + ':00', 'HH:mm');
    this.selectedHour = date.set({
        hour:   time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second')
    });
    this.domService.appendComponentToBody(MyComponent);
    // console.log('hour', this.selectedHour);
    const hourVal = {id: 0, name: this.schHour};
    if (hourVal.name) {
      event.target.innerHTML = hourVal.name;
      event.target.setAttribute('data-hid', hourVal.id);
    }
    console.log('clicked hour', event, hour, day);
  }

  ngOnInit() {
  }

}
