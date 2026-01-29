import { Howl, Howler } from 'howler';

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
  private onEnd?: () => void;
  private equalizerValues: number[] = [0, 0, 0, 0, 0];
  private equalizerNodes: BiquadFilterNode[] = [];

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
      volume: this.volume,
      onload: () => {
        console.log('Audio loaded:', track.title);
      },
      onplay: () => {
        console.log('Playing:', track.title);
        this.applyEqualizerChain();
      },
      onend: () => {
        console.log('Finished playing:', track.title);
        if (this.onEnd) this.onEnd();
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

  setOnEnd(handler?: () => void) {
    this.onEnd = handler;
  }

  setEqualizer(values: number[]) {
    this.equalizerValues = values.slice(0, 5);
    this.updateEqualizerNodes();
    this.applyEqualizerChain();
  }

  getEqualizerValues() {
    return [...this.equalizerValues];
  }

  private updateEqualizerNodes() {
    if (!Howler.usingWebAudio) return;
    if (this.equalizerNodes.length === 0) {
      const frequencies = [60, 230, 910, 3600, 14000];
      this.equalizerNodes = frequencies.map(freq => {
        const filter = Howler.ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.1;
        filter.gain.value = 0;
        return filter;
      });
    }
    this.equalizerNodes.forEach((node, index) => {
      node.gain.value = this.equalizerValues[index] ?? 0;
    });
  }

  private applyEqualizerChain() {
    if (!Howler.usingWebAudio) return;
    if (!this.sound) return;
    const soundData = (this.sound as unknown as { _sounds?: Array<{ _node?: AudioNode; _panner?: AudioNode; _gain?: AudioNode }> })._sounds?.[0];
    const source = soundData?._node;
    const output = soundData?._panner ?? soundData?._gain ?? Howler.masterGain;
    if (!source || !output) return;
    this.updateEqualizerNodes();
    if (this.equalizerNodes.length === 0) return;
    if (source.disconnect) {
      source.disconnect();
    }
    let current: AudioNode = source;
    this.equalizerNodes.forEach(node => {
      current.connect(node);
      current = node;
    });
    current.connect(output);
  }
}

export const audioService = new AudioService();
