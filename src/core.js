import { List, Map } from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

export function setRoutes(state, routes) {
  return state.set('navigation', routes);
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote').remove('entries').set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({
        round: state.getIn(['vote', 'round'], 0) + 1,
        pair: entries.take(2)
      }),
      entries: entries.skip(2)
    });
  }
}

function updateTallies(voteState, entry, movie) {
  const voterId = entry['voterId'];
  const entryName = entry['vote'];

  if (entryName === movie) {
    const existingTallies = voteState.getIn(['tally', movie]);

    if (existingTallies && !existingTallies.includes(voterId)) {
      voteState = voteState.updateIn(['tally', movie], [], tallyArray => {
        const newTallies = tallyArray.push(voterId);

        return newTallies;
      });
      return voteState;
    } else if (!existingTallies) {
      voteState = voteState.setIn(['tally', movie], List.of(voterId));
      return voteState;
    }
    return voteState;
  } else {
    voteState = voteState.updateIn(['tally', movie], [], tallyArray => {
      if (tallyArray.indexOf(voterId) >= 0) {
        tallyArray = tallyArray.splice(tallyArray.indexOf(voterId), 1);
      }
      return tallyArray;
    });
    return voteState;
  }
};
// TODO: clean this up ^^

export function vote(voteState, entry) {
  const pair = voteState.get('pair');
  if(pair.includes(entry['vote'])){
    pair.forEach(movie => {
      voteState = updateTallies(voteState, entry, movie);
    })
  }
  return voteState;
}

function getWinners(vote) {
  if (!vote) return [];

  const [a, b] = vote.get('pair').toArray();
  // TODO:  avoid toArray ^^
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);

  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}
