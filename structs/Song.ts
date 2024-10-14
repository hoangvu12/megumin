import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import { i18n } from "../utils/i18n";
import { isURL, videoPattern } from "../utils/patterns";

import { Readable } from "stream";
import { config } from "../utils/config";
import { getBasicVideoInfo, makeProxy, searchVideo } from "../utils/invidious";

export interface SongData {
  url: string;
  title: string;
  duration: number;
}

export class Song {
  public readonly url: string;
  public readonly title: string;
  public readonly duration: number;

  public constructor({ url, title, duration }: SongData) {
    this.url = url;
    this.title = title;
    this.duration = duration;
  }

  public static async from(url: string = "", search: string = "") {
    const isYoutubeUrl = videoPattern.test(url);

    let songInfo;

    if (isYoutubeUrl) {
      songInfo = await getBasicVideoInfo(url);

      return new this({
        url,
        title: songInfo.title,
        duration: songInfo.lengthSeconds
      });
    } else {
      const result = await searchVideo(search);

      if (result?.type !== "video") throw new Error("No video results found");

      if (!result) {
        let err = new Error(`No search results found for ${search}`);

        err.name = "NoResults";

        if (isURL.test(url)) err.name = "InvalidURL";

        throw err;
      }

      songInfo = await getBasicVideoInfo(`https://youtube.com/watch?v=${result.videoId}`);

      return new this({
        url: `https://youtube.com/watch?v=${result.videoId}`,
        title: songInfo.title,
        duration: songInfo.lengthSeconds
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Song> | void> {
    const songInfo = await getBasicVideoInfo(this.url);

    const format = songInfo.adaptiveFormats
      ?.sort((a, b) => {
        return parseInt(b.bitrate!) - parseInt(a.bitrate!);
      })
      .find((format) => format.type.startsWith("audio/"));

    if (!format) throw new Error("No audio formats found");

    let formatUrl = format.url;

    if (config.USE_INVIDIOUS_PROXY) {
      formatUrl = makeProxy(format.url);
    }
    const codec = format.encoding;

    const type: StreamType =
      codec === "opus" && format.container === "webm" ? StreamType.WebmOpus : StreamType.Arbitrary;

    const response = await fetch(formatUrl);

    const arrayBuffer = await response.arrayBuffer();

    const stream = new Readable({
      read() {
        this.push(Buffer.from(arrayBuffer));
        this.push(null);
      }
    });

    return createAudioResource(stream, {
      metadata: this,
      inputType: type,
      inlineVolume: true
    });
  }

  public startMessage() {
    return i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
  }
}
