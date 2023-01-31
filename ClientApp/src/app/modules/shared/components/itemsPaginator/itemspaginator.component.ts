import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import * as moment from 'moment';
import { Calendar, CalendarTypeView } from 'primeng/calendar';
import { Subject } from 'rxjs';
import { ItemsPaginator } from '../../generic/filters/pagination/ItemsPaginator';
import { UtilsService } from '../../Utils';
import { PaginationDateInterval  } from './models/models';

@Component({
	selector: 'items-paginator',
	templateUrl: './itemspaginator.component.html',
	styleUrls: ['./itemspaginator.component.scss']
})
export class ItemsPaginatorComponent implements OnInit{
	@Input() itemsPerPage: number = 100;
	currentPage: number = 0;
	@Output() onPageChanges  = new EventEmitter<number>();
	@Input() allLoaded : Subject<boolean> = new Subject<boolean>()

	message: string = ""
	lastPage?: number

	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService
	) {
	}

	ngOnInit(): void {
		this.setMessage();
		this.allLoaded.subscribe(val => {
			if(val)
				this.lastPage = this.currentPage;
		})
	}

	setMessage(){
		this.message = "From " + this.currentPage * this.itemsPerPage + " to " +  (this.currentPage+1) * this.itemsPerPage
	}


	nextClicked(){
		this.currentPage++;
		this.setMessage();
		this.onPageChanges.emit(this.currentPage);
	}
	previousClicked(){
		if(this.currentPage >= 1){
			this.currentPage--;
			this.setMessage();
			this.onPageChanges.emit(this.currentPage);
		}
	}
}
