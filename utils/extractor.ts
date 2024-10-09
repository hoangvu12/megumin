import { videoIdPattern, videoPattern } from "./patterns";

export const extractID = (url: string) => {
  const url_ = url.trim();
  if (url_.startsWith("https")) {
    if (url_.indexOf("list=") === -1) {
      const video_id = extractVideoId(url_);
      if (!video_id) throw new Error("This is not a YouTube url or videoId or PlaylistID");
      return video_id;
    } else {
      return url_.split("list=")[1].split("&")[0];
    }
  } else return url_;
};

function extractVideoId(urlOrId: string): string | false {
  if (urlOrId.startsWith("https://") && urlOrId.match(videoPattern)) {
    let id: string;
    if (urlOrId.includes("youtu.be/")) {
      id = urlOrId.split("youtu.be/")[1].split(/(\?|\/|&)/)[0];
    } else if (urlOrId.includes("youtube.com/embed/")) {
      id = urlOrId.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0];
    } else if (urlOrId.includes("youtube.com/shorts/")) {
      id = urlOrId.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0];
    } else if (urlOrId.includes("youtube.com/live/")) {
      id = urlOrId.split("youtube.com/live/")[1].split(/(\?|\/|&)/)[0];
    } else {
      id = (urlOrId.split("watch?v=")[1] ?? urlOrId.split("&v=")[1]).split(/(\?|\/|&)/)[0];
    }

    if (id.match(videoIdPattern)) return id;
  } else if (urlOrId.match(videoIdPattern)) {
    return urlOrId;
  }

  return false;
}
