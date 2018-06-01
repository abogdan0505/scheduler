import { Component, OnInit, Renderer2 } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-dd-table',
  templateUrl: './dd-table.component.html',
  styleUrls: ['./dd-table.component.sass']
})
export class DdTableComponent implements OnInit {
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
  schHour;
  draggedElem;
  offsetTop;
  transformToTime;
  dateHour;

  constructor(private renderer: Renderer2) {
    this.currentDate = moment();
    this.weekDays = this.getWeekDays(this.currentDate);
    this.displayHeaderData(this.weekDays[0]);
    this.currentStartDay = moment(this.weekDays[0]).format('MMMM DD');
    this.currentEndDay = moment(this.weekDays[6]).format('MMMM DD');
    this.hours = this.iterateThroughHours();
    // console.log(this.hours);
  }

  allowDrop(ev) {
    // ev.preventDefault();
    this.offsetTop = ev.pageY - this.draggedElem.offsetHeight / 2 + 'px';
    console.log('this.draggedElem', ev)
    // console.log('draggedElem', ev)
    // console.log('allowdrop', this.offsetTop, this.draggedElem);
    // console.log('top', this.draggedElem.target.style);
    const roundedMinutes = (15 * Math.round(this.offsetTop / 15));
    this.draggedElem.target.style.top = roundedMinutes > 0 || roundedMinutes === 0 ? roundedMinutes + 'px' : roundedMinutes + 15 + 'px';
    // this.draggedElem.target.style.top = this.offsetTop;
    if (ev.target === this.draggedElem.target) {
      this.transformToTime = ev.target.parentNode.dataset.day;
    } else {
      this.transformToTime = ev.target.dataset.day;
    }
    this.dateHour = moment(this.transformToTime).startOf('day').add(
      (15 * Math.round(this.offsetTop / 15)), 'minutes').format('MM/DD/YYYY HH:mm');
    // console.log('time', this.dateHour);
    // console.log('dragging', ev);
    // if (moment(ev.target.parentNode.dataset.day) > moment(this.dateHour)) {
    //   console.log('get sibling', ev.target.parentNode.parentElement.previousSibling.children[1]);
    // }
    this.draggedElem.target.style.position = 'relative';
    this.draggedElem.target.style.zIndex = 99999999999;
    ev.target.appendChild(this.draggedElem.target);
    // console.log('self', this.transformToTime);
  }

  mouseDownOccured(event) {
    console.log('mouseDownOccured', event);
  }

  drag(eve) {
    this.draggedElem = eve;
    


      const ball = this.draggedElem.target;
      const crt = ball.cloneNode(true);
      // const shiftX = ev.clientX - ball.getBoundingClientRect().left;
      const shiftY = eve.clientY - ball.getBoundingClientRect().top;

      ball.style.position = 'absolute';
      ball.style.zIndex = 1000;

      function moveAt(pageX, pageY) {
        // ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY - 120 + 'px';
      }

      function onMouseMove(ev) {
        moveAt(ev.pageX, ev.pageY);
      }
  
      // (3) move the ball on mousemove
      document.addEventListener('mousemove', onMouseMove);
  
      ball.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
      };
  
      // (4) drop the ball, remove unneeded handlers
      // ball.onmouseup = function() {
      //   document.removeEventListener('mousemove', onMouseMove);
      //   ball.onmouseup = null;
      // };

    // document.body.appendChild(crt);
    crt.style.backgroundColor = 'red';
    crt.style.position = 'relative';
    crt.style.cursor = 'move';
    this.draggedElem.target.style.cursor = 'move';
    
    this.draggedElem.dataTransfer.setDragImage(crt, 0, 0);
    // console.log('drag offsettop', ev.target.offsetTop, this.offsetTop)
    // ev.target.offsetTop = this.offsetTop;
    // console.log('dragstart', ev);
    // this.renderer.setStyle(this.draggedElem.target, 'visibility', 'hidden');
    this.draggedElem.dataTransfer.setData('text', ball.id);
    
    // ev.dataTransfer.setDragImage(this.draggedElem.target, 0, 0);
    
  }

  drop(ev) {
    ev.preventDefault();
    const ball = this.draggedElem.target;
    const shiftY = ev.clientY - ball.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
      // ball.style.left = pageX - shiftX + 'px';
      ball.style.top = pageY - shiftY - 120 + 'px';
    }

    function onMouseMove(ev) {
      moveAt(ev.pageX, ev.pageY);
    }
    this.draggedElem.onmouseup = function() {
      console.log('evvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
      document.removeEventListener('mousemove', onMouseMove);
      ball.onmouseup = null;
    };
    const data = ev.dataTransfer.getData('text');
    if (!ev.target.draggable) {
      // this.renderer.setStyle(this.draggedElem.target, 'min-width', '90px');
      // console.log('drop', ev.target.children);
      ev.target.appendChild(document.getElementById(data));
    }
  }

  nextWeek(dt) {
    this.weekDays = this.getWeekDays(moment(dt).add(1, 'days'));
    this.displayHeaderData(this.weekDays[0]);
    this.currentStartDay = moment(this.weekDays[0]).format('MMMM DD');
    this.currentEndDay = moment(this.weekDays[6]).format('MMMM DD');
  }

  iterateThroughHours() {
    const hours = [];
    for (let i = 0; i <= 24; i++) {
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
    // console.log('hour', this.selectedHour);
    const hourVal = {id: 0, name: this.schHour};
    if (hourVal.name) {
      event.target.innerHTML = hourVal.name;
      event.target.setAttribute('data-hid', hourVal.id);
    }
    // console.log('clicked hour', event, hour, day);
  }

  ngOnInit() {
  }

  // mouseDown(event) {
  //   const ball = event.target;
  //   const shiftX = event.clientX - ball.getBoundingClientRect().left;
  //   const shiftY = event.clientY - ball.getBoundingClientRect().top;

  //   ball.style.left = pageX - shiftX + 'px';
  //   ball.style.top = event.pageY - event.clientY - ball.getBoundingClientRect().top + 'px';

  //   ball.style.position = 'absolute';
  //   ball.style.zIndex = 1000;

  //   function moveAt(pageX, pageY) {
  //     ball.style.left = pageX - shiftX + 'px';
  //     ball.style.top = pageY - shiftY + 'px';
  //   }

  //   function onMouseMove(event) {
  //     moveAt(event.pageX, event.pageY);
  //   }

  //   // (3) move the ball on mousemove
  //   document.addEventListener('mousemove', onMouseMove);

  //   ball.onmouseup = function() {
  //     document.removeEventListener('mousemove', onMouseMove);
  //     ball.onmouseup = null;
  //   };

  //   // (4) drop the ball, remove unneeded handlers
  //   // ball.onmouseup = function() {
  //   //   document.removeEventListener('mousemove', onMouseMove);
  //   //   ball.onmouseup = null;
  //   // };
  // }

  preventDrag() {
    return false;
  }

}
