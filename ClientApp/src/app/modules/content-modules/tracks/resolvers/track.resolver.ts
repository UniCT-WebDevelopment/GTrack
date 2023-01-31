import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemResolver } from '../../../shared/generic/resolvers/item.resolver';
import { Track } from '../models/track';
import { TracksService } from '../tracks.service';


@Injectable({
  providedIn: 'root'
})
export class TrackResolver extends ItemResolver<Track> {
  constructor(itemService: TracksService, dialogService: DialogService<Track>) {
    super(itemService,dialogService)
  }
}