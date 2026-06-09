import { ResourceData } from './resource-data';
import { ArtistData } from './artist-data';
import { AlbumData } from './album-data';

export class TrackData extends ResourceData {
	album:AlbumData;
	artists:ArtistData[];
	duration_ms:number;

	constructor(objectModel:{}) {
		super(objectModel);
		this.category = "track";

		this.artists = objectModel['artists'].map((artist) => {
			return new ArtistData(artist);
		});

		if(objectModel['album']) {
			this.album = new AlbumData(objectModel['album']);
		}

		this.duration_ms = objectModel['duration_ms'];
	}

	//Return duration_ms in X:XX form (and drop ms component)
	get durationStr() {
		var minutes:number = Math.trunc(this.duration_ms / 60000); //60 sec/min * 100ms/sec
		var seconds:number = Math.trunc((this.duration_ms) / 1000 % 60); // 100ms/sec, get remainder
		return minutes.toString() + ':' + seconds.toString().padStart(2, '0');
	}
}
