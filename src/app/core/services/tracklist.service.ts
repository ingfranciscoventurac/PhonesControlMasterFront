import { Injectable } from '@angular/core';
import { GET_METHOD, POST_METHOD } from '../utils/https-requests';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
environment
@Injectable({
  providedIn: 'root'
})
export class TrackListService {

  supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  )

  constructor() {

  }

  private tracksSubject = new BehaviorSubject<any>(undefined);
  tracks$: Observable<any> = this.tracksSubject.asObservable();

  async getTracks(): Promise<any> {
    const { data, error } = await this.supabase.from("tracks").select("*");

    if (error) {
      console.error("Error fetching tracks:", error);
      return;
    }

    this.tracksSubject.next(data);
    return data;
  }

  async insertOrUpdateTrack(track: any) {
    const { data, error } = await this.supabase
      .from('tracks') // replace with your actual table name
      .upsert(track, {  // ✅ changed to `tracks`
        onConflict: 'trackId',
        ignoreDuplicates: true, // use string instead of array
      });
    if (error) {
      console.error('Error inserting/updating track:', error);
    } else {
      console.log('Track(s) inserted/updated:', data);
    }

  }

  async clearAllTracks(): Promise<void> {
    const { error } = await this.supabase
      .from('tracks')
      .delete()
      .neq('id', 0); // Condition that matches all rows

    if (error) {
      console.error('Error deleting rows:', error);
    } else {
      console.log('All rows deleted successfully!');
    }
  }





  async searchTrack(search: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('tracks')
      .select('*')
      .ilike('trackName', search)
    this.tracksSubject.next(data);
    if (error) {
      console.error('Error deleting rows:', error);
    } else {
      console.log('All rows deleted successfully!');
    }
  }


}
