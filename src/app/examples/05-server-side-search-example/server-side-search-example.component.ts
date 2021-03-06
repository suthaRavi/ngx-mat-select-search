import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, filter, map, takeUntil } from 'rxjs/operators';

import { Bank, BANKS } from '../demo-data';


@Component({
  selector: 'app-server-side-search-example',
  templateUrl: './server-side-search-example.component.html',
  styleUrls: ['./server-side-search-example.component.scss']
})
export class ServerSideSearchExampleComponent implements OnInit, OnDestroy {

  /** list of banks */
  protected banks: Bank[] = BANKS;

  /** control for the selected bank for server side filtering */
  public bankServerSideCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public bankServerSideFilteringCtrl: FormControl = new FormControl();

  /** list of banks filtered after simulating server side search */
  public  filteredServerSideBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  ngOnInit() {

    // listen for search field value changes
    this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(200),
        filter(search => !!search),
        map(search => {
          if (!this.banks) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(this.filteredServerSideBanks);

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
