import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import { i18n } from "../utils/i18n";
import { isURL, videoPattern } from "../utils/patterns";

import { Readable } from "stream";
import { config } from "../utils/config";
import { AdaptiveFormats, getBasicVideoInfo, makeProxy, searchVideo } from "../utils/invidious";

export interface SongData {
  url: string;
  title: string;
  duration: number;
  adaptiveFormats?: AdaptiveFormats;
}

export class Song {
  public readonly url: string;
  public readonly title: string;
  public readonly duration: number;
  public readonly adaptiveFormats?: AdaptiveFormats;

  public constructor({ url, title, duration, adaptiveFormats = [] }: SongData) {
    this.url = url;
    this.title = title;
    this.duration = duration;
    this.adaptiveFormats = adaptiveFormats;
  }

  public static async from(url: string = "", search: string = "") {
    const isYoutubeUrl = videoPattern.test(url);

    let songInfo;

    if (isYoutubeUrl) {
      songInfo = await getBasicVideoInfo(url);

      return new this({
        url,
        title: songInfo.title,
        duration: songInfo.lengthSeconds,
        adaptiveFormats: songInfo.adaptiveFormats
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
        duration: songInfo.lengthSeconds,
        adaptiveFormats: songInfo.adaptiveFormats
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Song> | void> {
    const format = this.adaptiveFormats
      ?.sort((a, b) => {
        return parseInt(b.bitrate!) - parseInt(a.bitrate!);
      })
      .find((format) => format.type.startsWith("audio/"));

    if (!format) throw new Error("No audio formats found");

    let formatUrl = format.url;

    if (config.USE_INVIDIOUS_PROXY) {
      formatUrl = makeProxy(format.url);
    }

    const response = await fetch(formatUrl);

    const arrayBuffer = await response.arrayBuffer();

    const stream = new Readable({
      read() {
        this.push(Buffer.from(arrayBuffer));
        this.push(null);
      }
    });

    const codec = format.encoding;

    const type: StreamType =
      codec === "opus" && format.container === "webm" ? StreamType.WebmOpus : StreamType.Arbitrary;

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
