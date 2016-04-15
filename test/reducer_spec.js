import { Map, List, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {
  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Trainspotting', '28DaysLater']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28DaysLater']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
      round: 1,
        pair: ['Trainspotting', '28DaysLater']
      },
      entries: []
    });
    const action = {
      type: 'VOTE',
      entry: Map({
              vote: 'Trainspotting',
              voterId: 1
            })
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28DaysLater'],
        tally: { "Trainspotting": [ 1 ] }
      },
      entries: []
    }));
  });

  it('handles SET_ROUTES', () => {
    const initialState = fromJS({ entries: ['Trainspotting'] })
    const action = {
      type: 'SET_ROUTES',
      routes: Map({
                "Vote": "/#/",
                "Results": "/#/results"
              })
    }
    // why a map?? ^^
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting'],
      navigation: {
                    "Vote": "/#/",
                    "Results": "/#/results"
                  }
    }));
  });

  it('has an initial state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Trainspotting', '28DaysLater']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: Map({ vote: 'Trainspotting', voterId: 4 })},
      {type: 'VOTE', entry: Map({ vote: '28DaysLater', voterId: 1 }) },
      {type: 'VOTE', entry: Map({ vote: 'Trainspotting', voterId: 2 }) },
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Trainspotting'
    }));
  });
});
