import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map, Subject } from "rxjs";
import { SearchCriteria } from "../models";

@Injectable()
export class GiphyService {

    onNewResult = new Subject<string[]>()

    constructor(private http: HttpClient) { }

    search(criteria: SearchCriteria): Promise<string[]> {

        const params = new HttpParams()
            .set('api_key', criteria.apiKey)
            .set('q', criteria.search)
            .set('limit', criteria.results)
            .set('rating', criteria.rating)

        return firstValueFrom(
            this.http.get<any>('https://api.giphy.com/v1/gifs/search', { params })
                .pipe(map(result => {
                    const data = result.data
                    console.log(":::::Result: ", result)
                    console.log(":::::Data: ", data)
                    return data.map((v: any) => v.images.fixed_height.url as string)
                    })
                )
        )
    }
}
