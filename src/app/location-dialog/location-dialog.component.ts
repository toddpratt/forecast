import {Component, OnInit, ViewChild} from '@angular/core';
import {Coordinates, Locations, OpenStreetMapService} from "../services/open-street-map.service";
import {Observable, tap} from "rxjs";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements OnInit {
  query!: string;
  locations$!: Observable<Locations>;
  result!: Coordinates;
  @ViewChild(MatSelect) select!: MatSelect;

  constructor(private readonly openStreetMapService: OpenStreetMapService) { }

  search() {
    this.locations$ = this.openStreetMapService.getLocation(this.query).pipe(
      tap(() => {
        setTimeout(() => {
          const option0 = this.select.options.get(0);
          if (option0) {
            this.select.value = option0.value;
          }
        }, 0);
      })
    );
  }

  ngOnInit(): void {
  }

}
