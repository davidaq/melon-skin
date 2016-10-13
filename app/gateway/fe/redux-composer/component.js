import select from './select';

let instCounter = 0;

const defaultInitialState = {};

class Component {

  constructor() {
    this.id = instCounter++;
    this.path = [];
  }

  reduce(state = defaultInitialState) {
    return state;
  }

  actions(selector) {
    return select(this, selector);
  }
}

export default Component;
