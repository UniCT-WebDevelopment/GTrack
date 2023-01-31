import { Injectable } from '@angular/core';
import { ItemsSyncResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Track } from '../models/track';
import { TracksService } from '../tracks.service';


@Injectable({
  providedIn: 'root'
})
export class TracksSyncResolver extends ItemsSyncResolver<Track> {
  constructor(itemService: TracksService, dialogService: DialogService<Track>) {
    super(itemService,dialogService)
  }
}