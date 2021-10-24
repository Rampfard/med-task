export default class Component {
  constructor() {
    this.state = {};
  }

  setState(state) {
    this.state =
      typeof state === 'function'
        ? state(this.state)
        : Object.assign(this.state, state);

    this.render();
  }
}
