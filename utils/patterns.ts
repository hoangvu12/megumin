export const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;
export const playlistPattern = /^.*(list=)([^#\&\?]*).*/;
export const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
export const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
export const isURL =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const videoIdPattern = /^[a-zA-Z\d_-]{11,12}$/;
export const playlistIdPattern = /^[a-zA-Z\d_-]{34}$/;
