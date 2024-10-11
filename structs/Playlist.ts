import { config } from "../utils/config";
import { getPlaylist, Playlist as InvidiousPlaylist, searchPlaylist } from "../utils/invidious";
import { playlistPattern } from "../utils/patterns";
import { Song } from "./Song";

export class Playlist {
  public data: InvidiousPlaylist;
  public videos: Song[];

  public constructor(playlist: InvidiousPlaylist) {
    this.data = playlist;

    this.videos = this.data.videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .slice(0, config.MAX_PLAYLIST_SIZE - 1)
      .map((video) => {
        return new Song({
          title: video.title!,
          url: `https://youtube.com/watch?v=${video.videoId}`,
          duration: video.lengthSeconds
        });
      });
  }

  public static async from(url: string = "", search: string = "") {
    let playlist: InvidiousPlaylist | undefined;

    if (playlistPattern.test(url)) {
      const playlistId = url.match(playlistPattern)?.[2];

      if (!playlistId) throw new Error("Invalid playlist URL");

      playlist = await getPlaylist(playlistId);
    } else {
      playlist = await searchPlaylist(search);
    }

    if (!playlist) throw new Error("No playlist results found");

    return new this(playlist);
  }
}
