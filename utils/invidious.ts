import { config } from "./config";
import { extractID } from "./extractor";

const INVIDIOUS_BASE_URL = config.INVIDIOUS_BASE_URL;

type VideoInvidiousResponse = {
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

export type Video = {
  type: "video";
  title: string;
  videoId: string;
  author: string;
  authorId: string;
  authorUrl: string;
  videoThumbnails: Array<{
    quality: string;
    url: string;
    width: number;
    height: number;
  }>;
  description: string;
  descriptionHtml: string;
  viewCount: number;
  published: number;
  publishedText: string;
  lengthSeconds: number;
  liveNow: boolean;
  paid: boolean;
  premium: boolean;
};

export type Playlist = {
  type: "playlist";
  title: string;
  playlistId: string;
  playlistThumbnail: string;
  author: string;
  authorId: string;
  authorUrl: string;
  authorVerified: boolean;

  videoCount: number;
  videos: Array<{
    title: string;
    videoId: string;
    lengthSeconds: number;
    videoThumbnails: Array<{
      quality: string;
      url: string;
      width: number;
      height: number;
    }>;
  }>;
};

export type AdaptiveFormats = VideoInvidiousResponse["adaptiveFormats"];

export const getBasicVideoInfo = async (url: string) => {
  const videoId = extractID(url);

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const response = await fetch(`${INVIDIOUS_BASE_URL}/api/v1/videos/${videoId}`);
  const data = (await response.json()) as VideoInvidiousResponse;

  return data;
};

export const search = async (query: string) => {
  const response = await fetch(`${INVIDIOUS_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}`);
  const data = (await response.json()) as (Video | Playlist)[];

  if (!data.length) return [];

  return data;
};

export const searchVideo = async (query: string): Promise<Video | undefined> => {
  const data = await search(query);

  const video = data.find((v) => v.type === "video");

  return video as Video | undefined;
};

export const searchPlaylist = async (query: string): Promise<Playlist | undefined> => {
  const data = await search(query);

  return data.find((v) => v.type === "playlist") as Playlist | undefined;
};

export const getPlaylist = async (playlistId: string): Promise<Playlist | undefined> => {
  const response = await fetch(`${INVIDIOUS_BASE_URL}/api/v1/playlists/${playlistId}`);
  const data = (await response.json()) as Playlist;

  return data as Playlist | undefined;
};

export const makeProxy = (url: string) => {
  const invidiousUrl = new URL(INVIDIOUS_BASE_URL);
  const formatUrlObject = new URL(url);

  formatUrlObject.hostname = invidiousUrl.hostname;

  return formatUrlObject.toString();
};
