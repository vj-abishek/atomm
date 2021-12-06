import TrackPlayer, { Event, State } from 'react-native-track-player';
import { Next, Previous } from './src/utils/play';

let wasPausedByDuck = false;

TrackPlayer.addEventListener([Event.PlaybackQueueEnded], () => {
  console.log('get song from background')
  Next()
})

module.exports = async function setup() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    Next()
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    Previous()
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async e => {
    if (e.paused === true) {
      const playerState = await TrackPlayer.getState();
      wasPausedByDuck = playerState !== State.Paused;
      TrackPlayer.pause();
    } else {
      if (wasPausedByDuck === true) {
        TrackPlayer.play();
        wasPausedByDuck = false;
      }
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));
};