import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { POST_METHOD, GET_METHOD } from '../../core/utils/https-requests';
import { createClient } from '@supabase/supabase-js'
import { FormsModule } from '@angular/forms';
import { TracksService } from '../../core/services/tracks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracklist',
  imports: [FormsModule, CommonModule],
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss'] // fixed to styleUrls
})
export class TrackListComponent implements OnInit, AfterViewInit {
  @ViewChild('trackTextarea') trackTextareaRef!: ElementRef<HTMLTextAreaElement>;

  trackString: string | undefined = undefined;
  spotifyUrl: any = '';
  playlistType: number = 0;
  userInfo: any = undefined;
  playlistId: string = "";
  searchingTrack: string = "";
  playlistUrl: string = "";
  playlistName: string = "";
  newTracks: any = "";
  shufflePlayList: boolean = false;
  fromPlaylistTracks: any = undefined;
  constructor(private route: ActivatedRoute, private router: Router, public tracksService: TracksService) { }

  ngOnInit(): void {
    // // Read the query parameters from the current URL
    // this.route.queryParamMap.subscribe(params => {
    //   const accessToken = params.get('access_token');
    //   const refreshToken = params.get('refresh_token');
    //   const expiresIn = params.get('expires_in');

    //   if (accessToken) {
    //     localStorage.setItem('spotify_access_token', accessToken);
    //     if (refreshToken) {
    //       localStorage.setItem('spotify_refresh_token', refreshToken);
    //     }
    //     if (expiresIn) {
    //       localStorage.setItem('spotify_expires_in', expiresIn);
    //     }

    //     // Clean the URL to avoid firing this logic again
    //     this.router.navigate(['/authorized'], { replaceUrl: true });

    //     // Redirect to dashboard
    //     this.router.navigate(['/'], { replaceUrl: true });
    //   } else {
    //     this.router.navigate(['/'], { replaceUrl: true });
    //   }
    // });

    // GET_METHOD("https://api.spotify.com/v1/me", true).then((response: any) => {
    //   this.userInfo = response;
    //   console.log(response);
    // })

    // this.tracksService.getTracks().then((response: any) => {
    // });


  }

  ngAfterViewInit(): void {
    // Extra fallback: attach paste listener directly to textarea if needed
    try {
      const ta = this.trackTextareaRef?.nativeElement;
      if (ta) {
        ta.addEventListener('paste', (e: ClipboardEvent) => this.onPaste(e));
      }
    } catch (err) {
      // ignore if viewchild not yet available or other environments
    }
  }

  async gettingAllTracksFromPlayList() {
    if (this.playlistUrl == "") {
      return;
    }
    const playListId = this.extractSpotifyPlaylistId(this.playlistUrl);
    const firstUrl = `https://api.spotify.com/v1/playlists/${playListId}/tracks?limit=100&offset=0`;
    const allTracks = await this.fetchAllTracks_followNext_GET(firstUrl);
    console.log("🚀 ~ DashboardComponent ~ gettingAllTracksFromPlayList ~ allTracks:", allTracks)
    const result = this.extractTracksInfo(allTracks);
    this.fromPlaylistTracks = result;
    console.log("🚀 ~ DashboardComponent ~ gettingAllTracksFromPlayList ~  this.fromPlaylistTracks:", this.fromPlaylistTracks)
  }

  extractSpotifyPlaylistId(url: string): string | null {
    const match = url.match(/^https:\/\/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)(\?.*)?$/);
    return match ? match[1] : null;
  }

  async fetchAllTracks_followNext_GET(firstPageUrl: string) {
    const allItems: any[] = [];
    let url: string | null = firstPageUrl;

    while (url) {
      const page = await GET_METHOD(url, true);
      if (!page || page.error) throw new Error('GET_METHOD returned an error for ' + url);

      allItems.push(...(page.items || []));
      url = page.next; // page.next is either a URL string or null
    }

    const tracks = allItems.map(it => it.track).filter(Boolean);
    return tracks;
  }

  async deleteTrack(id: number) {
    this.tracksService.deleteTrack(id).then((data: any) => {
      this.tracksService.getTracks().then((response: any) => {
      });
    })
  }

  /**
 * Adds tracks to a Spotify playlist in batches of 100.
 * @param playlistId Spotify Playlist ID
 * @param trackUris Array of Spotify track URIs
 */
  async addTracksToPlaylistFromPlayList(playlistId: string, trackUris: string[]) {
    if (!playlistId || !Array.isArray(trackUris) || trackUris.length === 0) {
      throw new Error("Invalid playlist ID or track URIs.");
    }

    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    // Spotify allows max 100 URIs per request
    for (let i = 0; i < trackUris.length; i += 100) {
      const batch = trackUris.slice(i, i + 100);
      await POST_METHOD(url, { uris: batch }, true);
      console.log(`✅ Added tracks ${i + 1} to ${i + batch.length}`);
    }

    console.log("🎵 All tracks have been added to the playlist.");
  }

  async createPlayList() {
    if (this.playlistName == "") return;

    const playlistResponse = await POST_METHOD(`https://api.spotify.com/v1/users/${this.userInfo.id}/playlists`,
      {
        "name": this.playlistName || "",
        "description": "",
        "public": "true"
      }, true);

    this.playlistId = playlistResponse.uri.split(':').pop();

    switch (this.playlistType) {
      case 0:
        this.playlistName = "";
        this.tracksService.getTracks().then(async (response: any) => {
          const trackUris = this.toSpotifyTrackUris(response);
          POST_METHOD(`https://api.spotify.com/v1/playlists/${this.playlistId}/tracks`,
            {
              "uris": trackUris,
              "position": 0
            }, true);
        });
        break;
      case 1:
        const trackUris = this.convertSpotifyUrlsToUris(this.spotifyUrl);
        POST_METHOD(`https://api.spotify.com/v1/playlists/${this.playlistId}/tracks`,
          {
            "uris": trackUris,
            "position": 0
          }, true);
        break;

    }
  }

  async createPlayListFromPlaylist() {
    if (this.playlistName == "") return;

    const playlistResponse = await POST_METHOD(`https://api.spotify.com/v1/users/${this.userInfo.id}/playlists`,
      {
        "name": this.playlistName || "",
        "description": "",
        "public": "true"
      }, true);

    this.playlistId = playlistResponse.uri.split(':').pop();

    const trackUris = this.toSpotifyTrackUris(this.fromPlaylistTracks);
    console.log("🚀 ~ DashboardComponent ~ createPlayListFromPlaylist ~ trackUris:", trackUris)
    this.addTracksToPlaylistFromPlayList(this.playlistId, trackUris)
  }

  async addTracksToPlaylist() {
    try {
      const { uris, ids } = this.convertSpotifyUrls(this.trackString || '');
      console.log(uris);
      console.log(ids);
      const trackNames = await this.fetchAllTracksParallel(ids);
      this.tracksService.insertOrUpdateTrack(trackNames).then((response: any) => {
        this.tracksService.getTracks().then((response: any) => {
        });
        this.searchingTrack = ""
      });
      console.log("🚀 ~ DashboardComponent ~ addTracksToPlaylist ~ trackNames:", trackNames)
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async addRandomTacksToPlaylist() {
    const playlists = [
      "3CFHJEDftKROeWruiyJbhU",
      "7u462zYpYcgQWgsOR6lxGy",
      "3zYm5ddPEHAmdXH3mJeAKc",
      "5SqR3iQ1rvzjjB8vEPlF8d"
    ];

    const randomPlaylist = this.getRandomPlaylistId(playlists);
    const firstUrl = `https://api.spotify.com/v1/playlists/${randomPlaylist}/tracks?limit=100&offset=0`;
    const allTracks = await this.fetchAllTracks_followNext_GET(firstUrl);
    const data = this.extractTracksInfo(allTracks);
    console.log("🚀 ~ DashboardComponent ~ addRandomTacksToPlaylist ~ this.fromPlaylistTracks:", this.fromPlaylistTracks)
    console.log("🚀 ~ DashboardComponent ~ addRandomTacksToPlaylist ~ data:", data)

    const mergedPlaylist = this.mergeWithPercentageAndNewIds(this.fromPlaylistTracks, data, 50);
    console.log("🚀 ~ DashboardComponent ~ addRandomTacksToPlaylist ~ mergedPlaylist:", mergedPlaylist)
    this.fromPlaylistTracks = mergedPlaylist;
    console.log("🚀 ~ DashboardComponent ~ addRandomTacksToPlaylist ~ this.fromPlaylistTracks:", this.fromPlaylistTracks)
  }


  /**
 * Merges first array with a percentage of elements from second array
 * @param firstArray - The base array
 * @param secondArray - The array to take elements from
 * @param percentage - Percentage of second array elements to take (0–100)
 * @returns A new merged array
 */
  mergeWithPercentageAndNewIds<T extends { id: number }>(
    firstArray: T[],
    secondArray: T[],
    percentage: number
  ): T[] {
    const safePercentage = Math.max(0, Math.min(percentage, 100));
    const itemsToTake = Math.floor((safePercentage / 100) * secondArray.length);

    // Shuffle second array and select items
    const shuffledSecond = [...secondArray].sort(() => Math.random() - 0.5);
    const selectedFromSecond = shuffledSecond.slice(0, itemsToTake);

    // Merge arrays
    const merged = [...firstArray, ...selectedFromSecond];

    // Reassign sequential IDs starting from 1
    const mergedWithNewIds = merged.map((item, index) => ({
      ...item,
      id: index + 1
    }));

    return mergedWithNewIds;
  }



  getRandomPlaylistId(playlistIds: string[]): string | null {
    if (!playlistIds.length) return null; // Return null if the array is empty

    const randomIndex = Math.floor(Math.random() * playlistIds.length);
    return playlistIds[randomIndex];
  }

  async fetchAllTracksParallel(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Track IDs array must not be empty");
    }

    const promises = ids.map(async trackId => {
      const cleanId = trackId.split(":").pop(); // supports both URI or raw ID
      const trackData = await GET_METHOD(`https://api.spotify.com/v1/tracks/${cleanId}`, true);
      return ({
        ...this.extractNameAndSinger(trackData) // merge with extracted fields
      });
    });

    return Promise.all(promises);
  }

  async shuffleTracks() {
    this.tracksService.getTracks().then((response: any) => {
      const shuffledTracks = this.shuffleWithIds(response);
      this.tracksService.clearAllTracks().then(() => {
        this.tracksService.insertOrUpdateTrack(shuffledTracks).then((response: any) => {
          this.tracksService.getTracks().then((response: any) => {
          });
          this.searchingTrack = ""
        });
      })
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]; // copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
    }
    return shuffled;
  }

  shuffleWithIds(data: any[]): any[] {
    // Step 1: Shuffle objects
    const shuffledObjects = this.shuffleArray(data);

    // Step 2: Shuffle IDs
    const ids = this.shuffleArray(shuffledObjects.map(item => item.id));

    // Step 3: Reassign shuffled IDs to shuffled objects
    return shuffledObjects.map((obj, index) => ({
      ...obj,
      id: ids[index]
    }));
  }

  extractNameAndSinger(trackResponse: any) {
    // Defensive checks in case data is missing
    const trackId = trackResponse?.id ?? 'Unknown track';
    const trackName = trackResponse?.name ?? 'Unknown track';
    const artistId = trackResponse?.artists?.[0]?.id ?? 'Unknown artist';
    const artistName = trackResponse?.artists?.[0]?.name ?? 'Unknown artist';

    return { trackId, trackName, artistId, artistName };
  }

  async searchTrack() {
    if (this.searchingTrack == "") {
      this.tracksService.getTracks().then((response: any) => {
      });
    }
    this.tracksService.searchTrack(this.searchingTrack);
  }

  async clearPlaylist() {
    this.tracksService.clearAllTracks().then((response: any) => {
      this.tracksService.getTracks().then((response: any) => {
      });
    });
  }

  clearTracksPlayList() {
    this.spotifyUrl = "";
  }

  toSpotifyTrackUris(data: { trackId: string }[]): string[] {
    return data.map(item => `spotify:track:${item.trackId}`);
  }

  convertSpotifyUrlsToUris(urlsString: string): string[] {
    if (!urlsString) return [];

    return urlsString
      .split(',')
      .map(url => url.trim()) // remove extra spaces
      .filter(url => url.length > 0) // remove empty strings
      .map(url => {
        // Match the track ID in a standard Spotify track URL
        const match = url.match(/^https:\/\/open\.spotify\.com\/track\/([A-Za-z0-9]+)(\?.*)?$/);
        return match ? `spotify:track:${match[1]}` : null;
      })
      .filter((uri): uri is string => uri !== null); // remove invalid URLs
  }

  convertSpotifyUrls(input: string) {
    if (typeof input !== "string" || !input.trim()) {
      throw new Error("Input must be a non-empty string.");
    }

    const urls = input.split(",").map(url => url.trim());
    const uris: string[] = [];
    const ids: string[] = [];

    const spotifyUrlPattern = /^https:\/\/open\.spotify\.com\/track\/([A-Za-z0-9]+)(\?.*)?$/;

    urls.forEach((url, index) => {
      const match = url.match(spotifyUrlPattern);
      if (!match) {
        throw new Error(`Invalid Spotify track URL at position ${index + 1}: ${url}`);
      }

      const trackId = match[1];
      uris.push(`spotify:track:${trackId}`);
      ids.push(trackId);
    });

    return { uris, ids };
  }

  // ---------------------------
  // New / changed methods below
  // ---------------------------

  /** Prevent typing but allow paste shortcuts and navigation keys */
  preventTyping(e: KeyboardEvent) {
    // Allow Ctrl/Cmd + V for paste
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') return;
    // Allow navigation and editing keys that don't type characters
    const allowed = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    // Prevent everything else (typing)
    e.preventDefault();
  }

  extractTracksInfo(tracksArray: any) {
    if (!Array.isArray(tracksArray)) {
      throw new Error("Expected an array of track objects");
    }

    return tracksArray.map((track, index) => ({
      id: index + 1,
      trackId: track.id,
      trackName: track.name,
      artistId: track.artists?.[0]?.id || null,
      artistName: track.artists?.[0]?.name || null,
    }));
  }

  shuffleCurrentPlayList() {
    const response = this.shuffleWithIds(this.fromPlaylistTracks);
    this.fromPlaylistTracks = response
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain') || '';
    if (!data) return;
    this.addUrlsFromText(data);
  }

  onPaste(e: ClipboardEvent) {
    // handle paste programmatically so we can extract urls and append them correctly
    e.preventDefault();
    const clipboard = e.clipboardData;
    if (!clipboard) return;
    const text = clipboard.getData('text/plain');
    this.addUrlsFromText(text);
  }

  /**
   * Extracts URLs from text and appends them to trackString separated by commas.
   * If text includes comma-separated urls, this still works.
   */
  addUrlsFromText(text: string | null) {
    if (!text || !text.trim()) return;

    // Regex to extract http/https URLs (keeps query params). Accepts multiple urls in text.
    const urlRegex = /https?:\/\/[^\s,]+/gi;
    const matches = text.match(urlRegex) || [];

    if (matches.length === 0) {
      // If none matched but the text includes commas, try splitting by comma and trimming
      const possibleParts = text.split(',').map(s => s.trim()).filter(Boolean);
      if (possibleParts.length === 0) return;
      possibleParts.forEach(part => this.appendUrlToTrackString(part));
      return;
    }

    matches.forEach(rawUrl => {
      const url = rawUrl.trim().replace(/,$/, ''); // remove trailing comma if any
      this.appendUrlToTrackString(url);
    });
  }

  clearTracksList() {
    this.trackString = "";
  }
  /** Appends a single URL to trackString, adding a comma if there's already content */
  appendUrlToTrackString(url: string) {
    if (!url) return;
    if (!this.trackString || !this.trackString.trim()) {
      this.trackString = url;
    } else {
      // ensure previous content ends with a comma
      const trimmed = this.trackString.trim();
      if (trimmed.endsWith(',')) {
        this.trackString = `${trimmed} ${url}`; // keep comma spacing tidy
      } else {
        this.trackString = `${trimmed}, ${url}`;
      }
    }
  }

  onSpotifyUrlDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop
  }

  onSpotifyUrlDrop(event: DragEvent) {
    event.preventDefault();

    const data = event.dataTransfer?.getData('text/plain') || '';
    const url = data.trim();

    // Validate Spotify track URL
    const spotifyUrlPattern = /^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]+(\?.*)?$/;
    if (!spotifyUrlPattern.test(url)) {
      console.warn('Invalid Spotify URL:', url);
      return;
    }

    // Append with comma if already has content
    if (this.spotifyUrl && this.spotifyUrl.trim() !== '') {
      this.spotifyUrl = `${this.spotifyUrl.trim()}, ${url}`;
    } else {
      this.spotifyUrl = url;
    }
  }
}
