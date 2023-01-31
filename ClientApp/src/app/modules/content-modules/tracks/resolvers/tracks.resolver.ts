import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { Track } from '../models/track';
import { TracksService } from '../tracks.service';


@Injectable({
  providedIn: 'root'
})
export class TracksResolver extends ItemsResolver<Track> {
  constructor(itemService: TracksService, dialogService: DialogService<Track>) {
    super(itemService,dialogService)
  }
}