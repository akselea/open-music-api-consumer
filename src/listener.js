const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistsService.getSongOnPlaylist(playlistId);
      const playlistSongs = {
        playlist: {
          ...playlist,
          songs,
        },
      };
      console.log(playlistSongs);

      const result = await this._mailSender.sendEmail(targetEmail, playlistId, JSON.stringify(playlistSongs));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
