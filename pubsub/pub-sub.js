class VotingPubSub {
  constructor() {
    this.channels = {};
  }

  subscribe(channel, subscriber) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }

    this.channels[channel].push(subscriber);
  }

  publish(channel, message) {
    if (!this.channels[channel]) {
      return;
    }

    for (const subscriber of this.channels[channel]) {
      subscriber(message);
    }
  }
}
export const voting = new VotingPubSub();


class RoomPubSub {
  constructor() {
    this.channels = {};
  }

  subscribe(channel, subscriber) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }

    this.channels[channel].push(subscriber);
  }

  publish(channel, message) {
    if (!this.channels[channel]) {
      return;
    }

    for (const subscriber of this.channels[channel]) {
      subscriber(message);
    }
  }
}

export const roomws = new RoomPubSub();

