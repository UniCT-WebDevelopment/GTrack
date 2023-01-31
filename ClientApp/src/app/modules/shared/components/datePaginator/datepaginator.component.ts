import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import * as moment from 'moment';
import { Calendar, CalendarTypeView } from 'primeng/calendar';
import { UtilsService } from '../../Utils';
import { PaginationDateInterval  } from './models/models';

@Component({
	selector: 'date-paginator',
	templateUrl: './datepaginator.component.html',
	styleUrls: ['./datepaginator.component.scss']
})
export class DatePaginatorComponent implements OnInit{
	@Input() interval?: PaginationDateInterval
	@Input() initialDate: Date = moment().startOf('day').toDate()
	@Output() onSelectionChanges  = new EventEmitter<Date>();
	@ViewChild("calendar", { static: false }) calendar: Calendar | undefined = undefined
	selectedDate : Date
	dateFormat: string = "yy/mm/dd"
	viewFormat: CalendarTypeView = "month"
	
	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService
	) {
		this.initialDate = moment(this.initialDate).startOf('day').toDate(); 
		this.selectedDate = this.initialDate;
		
	}

	ngOnInit(): void {
		if(!this.interval) 
			this.interval = PaginationDateInterval.Month
		this.setDateFormat()
		this.setViewFormat()
	}

	onSelect(value: Date){
		this.onSelectionChanges.emit(value)
	}

	nextClicked(){
		if(this.calendar){
			let nextDate = moment(this.selectedDate).add(1,this.interval);
			this.selectedDate = nextDate.toDate();
			this.calendar.onSelect.emit(this.selectedDate);
		}
	}
	previousClicked(){
		if(this.calendar){
			let nextDate = moment(this.selectedDate).subtract(1,this.interval);
			this.selectedDate = nextDate.toDate();
			this.calendar.onSelect.emit(this.selectedDate);
		}
	}

	setDateFormat(){
		switch(this.interval){
			case PaginationDateInterval.Month: 
				this.dateFormat = "MM yy"
			break;

			case PaginationDateInterval.Week:
				this.dateFormat = "MM yy - ww" //not working, ask to fabri
			break;

			case PaginationDateInterval.Day:
				this.dateFormat = "dd/MM/yy"
			break;
		}
	}

	setViewFormat(){
		switch(this.interval){
			case PaginationDateInterval.Month: 
				this.viewFormat = "month"
			break;

			case PaginationDateInterval.Week:
				this.viewFormat = "date"
			break;

			case PaginationDateInterval.Day:
				this.viewFormat = "date"
			break;
		}
	}
}
