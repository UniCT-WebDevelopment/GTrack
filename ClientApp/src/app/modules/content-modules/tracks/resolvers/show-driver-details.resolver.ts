import { Injectable } from '@angular/core';
import { ShowDetailsResolver } from 'src/app/modules/shared/generic/resolvers/show-details.resolver';
import { Track } from '../models/track';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';


@Injectable({
  providedIn: 'root'
})
export class ShowTruckDetailsResolver extends ShowDetailsResolver<Track> {
  constructor(protected ds: DetailsDialogService<Track>) {
    super(ds)
  }
}