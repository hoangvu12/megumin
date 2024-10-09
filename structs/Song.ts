import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { i18n } from "../utils/i18n";
import { isURL, videoPattern } from "../utils/patterns";

import { Readable } from "stream";
import { extractID } from "../utils/extractor";
import { config } from "../utils/config";

const INVIDIOUS_BASE_URL = "https://inv.nadeko.net";

type InvidiousResponse = {
  type: string;
  title: string;
  videoId: string;
  videoThumbnails: Array<{
    quality: string;
    url: string;
    width: number;
    height: number;
  }>;
  storyboards: Array<{
    url: string;
    templateUrl: string;
    width: number;
    height: number;
    count: number;
    interval: number;
    storyboardWidth: number;
    storyboardHeight: number;
    storyboardCount: number;
  }>;
  description: string;
  descriptionHtml: string;
  published: number;
  publishedText: string;
  keywords: Array<string>;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  paid: boolean;
  premium: boolean;
  isFamilyFriendly: boolean;
  allowedRegions: Array<string>;
  genre: string;
  genreUrl: any;
  author: string;
  authorId: string;
  authorUrl: string;
  authorVerified: boolean;
  authorThumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  subCountText: string;
  lengthSeconds: number;
  allowRatings: boolean;
  rating: number;
  isListed: boolean;
  liveNow: boolean;
  isPostLiveDvr: boolean;
  isUpcoming: boolean;
  dashUrl: string;
  adaptiveFormats: Array<{
    init: string;
    index: string;
    bitrate: string;
    url: string;
    itag: string;
    type: string;
    clen: string;
    lmt: string;
    projectionType: string;
    container: string;
    encoding: string;
    audioQuality?: string;
    audioSampleRate?: number;
    audioChannels?: number;
    fps?: number;
    size?: string;
    resolution?: string;
    qualityLabel?: string;
    colorInfo?: {
      primaries: string;
      transferCharacteristics: string;
      matrixCoefficients: string;
    };
  }>;
  formatStreams: Array<{
    url: string;
    itag: string;
    type: string;
    quality: string;
    bitrate: string;
    fps: number;
    size: string;
    resolution: string;
    qualityLabel: string;
    container: string;
    encoding: string;
  }>;
  captions: Array<{
    label: string;
    language_code: string;
    url: string;
  }>;
  recommendedVideos: Array<{
    videoId: string;
    title: string;
    videoThumbnails: Array<{
      quality: string;
      url: string;
      width: number;
      height: number;
    }>;
    author: string;
    authorUrl: string;
    authorId: string;
    authorVerified: boolean;
    lengthSeconds: number;
    viewCountText: string;
    viewCount: number;
  }>;
};

const getBasicVideoInfo = async (url: string) => {
  const videoId = extractID(url);

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const response = await fetch(`https://inv.nadeko.net/api/v1/videos/${videoId}`);
  const data = (await response.json()) as InvidiousResponse;

  return data;
};

export interface SongData {
  url: string;
  title: string;
  duration: number;
  adaptiveFormats?: InvidiousResponse["adaptiveFormats"];
}

export class Song {
  public readonly url: string;
  public readonly title: string;
  public readonly duration: number;
  public readonly adaptiveFormats?: InvidiousResponse["adaptiveFormats"];

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
      const result = await youtube.searchOne(search);

      result ? null : console.log(`No results found for ${search}`);

      if (!result) {
        let err = new Error(`No search results found for ${search}`);

        err.name = "NoResults";

        if (isURL.test(url)) err.name = "InvalidURL";

        throw err;
      }

      songInfo = await getBasicVideoInfo(`https://youtube.com/watch?v=${result.id}`);

      return new this({
        url: `https://youtube.com/watch?v=${result.id}`,
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

    if (!format) return;

    let formatUrl = format.url;

    if (config.USE_INVIDIOUS_PROXY) {
      const invidiousUrl = new URL(INVIDIOUS_BASE_URL);
      const formatUrlObject = new URL(format.url);

      formatUrlObject.hostname = invidiousUrl.hostname;

      formatUrl = formatUrlObject.toString();
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
