import { Howl } from 'howler';

export interface Track {
  id: string;
  path: string;
  title: string;
  artist?: string;
  duration?: number;
}

class AudioService {
  private sound: Howl | null = null;
  private currentTrack: Track | null = null;
  private volume: number = 0.5;

  play(track: Track) {
    if (this.currentTrack?.id === track.id && this.sound) {
      this.sound.play();
      return;
    }

    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
    }

    this.currentTrack = track;
    this.sound = new Howl({
      src: [`file://${track.path}`],
      html5: true, // Use HTML5 Audio for large files
      volume: this.volume,
      onload: () => {
        console.log('Audio loaded:', track.title);
      },
      onplay: () => {
        console.log('Playing:', track.title);
      },
      onend: () => {
        console.log('Finished playing:', track.title);
      },
      onloaderror: (id, error) => {
        console.error('Audio load error:', error);
      }
    });

    this.sound.play();
  }

  pause() {
    if (this.sound) {
      this.sound.pause();
    }
  }

  stop() {
    if (this.sound) {
      this.sound.stop();
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.sound) {
      this.sound.volume(volume);
    }
  }

  getVolume() {
    return this.volume;
  }

  getDuration() {
    return this.sound?.duration() || 0;
  }

  getSeek() {
    return this.sound?.seek() as number || 0;
  }

  seek(position: number) {
    if (this.sound) {
      this.sound.seek(position);
    }
  }

  isPlaying() {
    return this.sound?.playing() || false;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }
}

export const audioService = new AudioService();
