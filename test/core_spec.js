import { List, Map } from 'immutable';
import { expect } from 'chai';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28DaysLater');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28DaysLater')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28DaysLater'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28DaysLater')
      }));
    })
  });

  describe('next', () => {
    const state = Map({
      entries: List.of('Trainspotting', '28DaysLater', 'Sunshine')
    });
    const nextState = next(state);

    expect(nextState).to.equal(Map({
      vote: Map({
        pair: List.of('Trainspotting', '28DaysLater')
      }),
      entries: List.of('Sunshine')
    }));

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28DaysLater'),
          tally: Map({
            'Trainspotting': 4,
            '28DaysLater': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28DaysLater'),
          tally: Map({
            'Trainspotting': 2,
            '28DaysLater': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28DaysLater')
      }));
    })

    it('marks winner when just one entry is left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28DaysLater'),
          tally: Map({
            'Trainspotting': 4,
            '28DaysLater': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }))
    });
  });

  describe('vote', () => {
    it('should not tally votes for entries not in the pair', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28DaysLater')
      });
      const nextState = vote(state, 'Sunshine');

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28DaysLater')
      }));
    });

    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28DaysLater')
      });
      const nextState = vote(state, 'Trainspotting');

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28DaysLater'),
        tally: Map({ 'Trainspotting': 1 })
      }));
    });

    it('adds to the existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28DaysLater'),
        tally: Map({
          'Trainspotting': 3,
          '28DaysLater': 2
        })
      });
      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28DaysLater'),
        tally: Map({
          'Trainspotting': 4,
          '28DaysLater': 2
        })
      }));
    });
  });
});
