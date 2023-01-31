import { Injectable } from '@angular/core';
import { Track } from '../models/track';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { HideDetailsResolver } from 'src/app/modules/shared/generic/resolvers/hide-details.resolver';


@Injectable({
  providedIn: 'root'
})
export class HideTruckDetailsResolver extends HideDetailsResolver<Track> {
  constructor(protected ds: DetailsDialogService<Track>) {
    super(ds)
  }
}