import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //Specifically, update the URI according to the base URL for express and the endpoint.
    var uri:string = `${this.expressBaseUrl}${endpoint}`;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    const encodedResource = encodeURIComponent(resource);
    const endpoint = `/search/${category}/${encodedResource}`;

    return this.sendRequestToExpress(endpoint).then((data: any) => {
      if (category === 'artist') {
        return data.artists.items.map((item: any) => new ArtistData(item));
      } else if (category === 'album') {
        return data.albums.items.map((item: any) => new AlbumData(item));
      } else { // 'track'
        return data.tracks.items.map((item: any) => new TrackData(item));
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    const encodedId = encodeURIComponent(artistId);
    const endpoint = `/artist/${encodedId}`;

    return this.sendRequestToExpress(endpoint).then((data: any) => {
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    const encodedId = encodeURIComponent(artistId);
    const endpoint = `/artist-top-tracks/${encodedId}`;

    return this.sendRequestToExpress(endpoint).then((data: any) => {
      // Spotify response shape: { tracks: [...] }
      const tracksArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.tracks)
          ? data.tracks
          : [];

      return tracksArray.map((t: any) => new TrackData(t));
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    const encodedId = encodeURIComponent(artistId);
    const endpoint = `/artist-albums/${encodedId}`;

    return this.sendRequestToExpress(endpoint).then((data: any) => {
      // Spotify response shape: { items: [...] }
      const itemsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : (data?.albums && Array.isArray(data.albums.items))
            ? data.albums.items
            : [];

      return itemsArray.map((a: any) => new AlbumData(a));
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    const endpoint = `/album/${encodeURIComponent(albumId)}`;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    const endpoint = `/album-tracks/${encodeURIComponent(albumId)}`;
    return this.sendRequestToExpress(endpoint).then((data: any) => {
      const itemsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
          ? data.items
          : [];

      return itemsArray.map((t: any) => new TrackData(t));
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    const endpoint = `/track/${encodeURIComponent(trackId)}`;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }
}