import { MWMediaType } from "@/backend/metadata/types/mw";
import { LoadableSource, SourceQuality } from "@/stores/player/utils/qualities";
import { Listener } from "@/utils/events";

export type DisplayErrorType = "hls" | "htmlvideo" | "global";
export type DisplayError = {
  stackTrace?: string;
  message?: string;
  key?: string;
  errorName: string;
  type: DisplayErrorType;
};

export type DisplayInterfaceEvents = {
  play: void;
  pause: void;
  fullscreen: boolean;
  volumechange: number;
  time: number;
  duration: number;
  buffered: number;
  loading: boolean;
  qualities: SourceQuality[];
  changedquality: SourceQuality | null;
  needstrack: boolean;
  canairplay: boolean;
  playbackrate: number;
  error: DisplayError;
};

export interface qualityChangeOptions {
  source: LoadableSource | null;
  automaticQuality: boolean;
  preferredQuality: SourceQuality | null;
  startAt: number;
}

export interface DisplayMeta {
  title: string;
  type: MWMediaType;
}

export interface DisplayCaption {
  srtData: string;
  language: string;
  url?: string;
}

export type DisplayType = "web" | "casting";

export interface DisplayInterface extends Listener<DisplayInterfaceEvents> {
  play(): void;
  pause(): void;
  load(ops: qualityChangeOptions): void;
  changeQuality(
    automaticQuality: boolean,
    preferredQuality: SourceQuality | null,
  ): void;
  processVideoElement(video: HTMLVideoElement): void;
  processContainerElement(container: HTMLElement): void;
  toggleFullscreen(): void;
  togglePictureInPicture(): void;
  setSeeking(active: boolean): void;
  setVolume(vol: number): void;
  setTime(t: number): void;
  destroy(): void;
  startAirplay(): void;
  setPlaybackRate(rate: number): void;
  setMeta(meta: DisplayMeta): void;
  setCaption(caption: DisplayCaption | null): void;
  getType(): DisplayType;
}
