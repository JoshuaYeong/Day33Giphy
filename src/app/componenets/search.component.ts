import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCriteria } from '../models';
import { GiphyService } from '../services/giphy.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm!: FormGroup

  constructor(private fb: FormBuilder, private giphySvc: GiphyService) { }

  ngOnInit(): void {
    this.searchForm = this.createForm()
  }

  private createForm(): FormGroup {
    return this.fb.group({
      apiKey: this.fb.control<string>(this.getAPIKey(), [Validators.required]),
      search: this.fb.control<string>("", [Validators.required]),
      results: this.fb.control<number>(5),
      rating: this.fb.control<string>("g")
    })
  }

  private getAPIKey(): string {
    let key = localStorage.getItem('apiKey')
    if (!key) {
      return ""
    } else {
      return key
    }
  }

  private saveAPIKey(key: string) {
    localStorage.setItem('apiKey', key)
  }

  performSearch() {
    const criteria: SearchCriteria = this.searchForm.value as SearchCriteria
    // console.log(':::SEARCH CRITERIA: ', criteria)
    this.giphySvc.search(criteria)
    .then(result => {
      // console.log(":::RESULTS: ", result)

      this.saveAPIKey(criteria.apiKey)
      this.giphySvc.onNewResult.next(result)

    }).catch(error => {
      console.error(":::ERROR: ", error)
      alert(`>>>>>ERROR: ${JSON.stringify(error)}`)
    })
    this.searchForm = this.createForm()
  }

}
