import EventEmitter from 'eventemitter3';

const Emitter = new EventEmitter();

const eventEmitter = {
  on: (event, fn) => Emitter.on(event, fn),
  once: (event, fn) => Emitter.once(event, fn),
  off: (event, fn) => Emitter.off(event, fn),
  emit: (event, payload) => Emitter.emit(event, payload)
}

console.log("eventEmitter", eventEmitter)
Object.freeze(eventEmitter);

export default eventEmitter;
