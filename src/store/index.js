import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/axios';
import has from 'lodash.has';
import shuffle from 'lodash.shuffle';
import values from 'lodash.values';
import { calcPoints } from '@/utils';

Vue.use(Vuex)

// Convenience function for mutations to reduce boilerplate
const set = key => (state, val) => {
  state[key] = val;
};

/**
 * input: '{v,r,t}''
 * output: ['v','r','t']
 * @param  {String} str
 * @return {[String]}
 */
const parseCharArray = (str) => str.replace(/[{}]/g, "").split(',');

/**
 * input ['kiwi', 'melon']
 * output "{kiwi,melon}"
 * @param  {[String]} arr
 * @return {String}
 */
const prepStrArray = (arr) => `{${arr.join()}}`;

export default new Vuex.Store({
  state: {
    showDebugger: false,

    users: {},
    puzzles: {},
    puzzleOrder: [],
    puzzleProgress: {},
    userId: 0,
    puzzleId: 0,

    // UI
    input: '',

    // On mobile, we show the scoreboard as a modal
    modal: null,
  },

  mutations: {
    // Users
    setUsers(state, val) {
      Vue.set(state, 'users', val);
    },
    setUserId(state, val) {
      state.userId = val;
      localStorage.setItem('userId', val);
    },
    clearUser(state) {
      state.user = {};
      localStorage.removeItem('userId');
    },

    // Puzzles
    setPuzzles(state, val) {
      Vue.set(state, 'puzzles', val);
    },
    setPuzzleId: set('puzzleId'),

    shuffleOuterLetters(state) {
      state.puzzles[state.puzzleId].outer_letters =  shuffle(state.puzzles[state.puzzleId].outer_letters);
    },

    // Progress
    setPuzzleProgress(state, val) {
      Vue.set(state, 'puzzleProgress', val);
    },

    // val param: { id: 30, puzzle_id: 11, user_id: 3, ... }
    addUserPuzzleProgress(state, val) {
      Vue.set(state.puzzleProgress, val.user_id, val);
    },

    pushFoundWord(state, data) {
      const { userId, word } = data;
      const words = state.puzzleProgress[userId].found_words;
      words.push(word);
      words.sort();
    },

    setSetting(state, data) {
      const { setting, value } = data;
      state.puzzleProgress[state.userId][setting] = value;
    },

    // Input
    addInputLetter(state, val) {
        state.input = state.input + val;
    },
    clearInput(state) {
      state.input = '';
    },
    removeInputLetter(state) {
      state.input = state.input.slice(0, -1);
    },
    setInput(state, val) {
      state.input = val;
    },

    // Modals
    openModal(state, val) {
      state.modal = val;
    },

    closeModal(state) {
      state.modal = null;
    },
  },

  getters: {
    userProgressDataLoaded: (state) => {
      return !!state.puzzleProgress[state.userId];
    },

    user: (state) => {
      return state.users[state.userId] || {};
    },

    puzzle: (state) => {
      return state.puzzles[state.puzzleId] || {};
    },

    puzzleOrderIndex: (state) => {
      console.log(state.puzzleId);
      return state.puzzleOrder.indexOf(state.puzzleId);
    },

    newestPuzzle: (state) => {
      return state.puzzles[state.puzzleOrder[state.puzzleOrder.length - 1]];
      // const puzzles = values(state.puzzles);
      // return puzzles[puzzles.length - 1];
    },

    teamMode: (state) => state.puzzleProgress[state.userId].team_mode,
    hint: (state) => state.puzzleProgress[state.userId].hint,
    revealed: (state) => state.puzzleProgress[state.userId].revealed,
    foundWords: (state) => state.puzzleProgress[state.userId].found_words,
    teamFoundWords: (state) => {
      const words = [];
      values(state.puzzleProgress).forEach(progress => {
        words.push(...progress.found_words);
      })
      return [...new Set(words)];
    },

    // UI
    letters: (state, getters) => {
      if (!getters.puzzle) return [];
      return [getters.puzzle.center_letter, ...getters.puzzle.outer_letters];
    },
    points: (state, getters) => calcPoints(getters.foundWords, getters.letters),
    teamPoints: (state, getters) => calcPoints(getters.teamFoundWords, getters.letters),
    pointsForGenius: (state, getters) => {
      return Math.ceil(getters.possiblePoints * 0.9);
    },
    possiblePoints: (state, getters) => {
      if (!getters.puzzle) return 0;
      return calcPoints(getters.puzzle.answers, getters.letters)
    },
  },

  actions: {
    /**
     * Loads all user data. Used to bootstrap app.
     * @return {Promise}]
     */
    loadUsers: ({ commit }) => {
      return axios.get('/users')
        .then(res => {
          const users = {};
          res.data.forEach(user => {
            users[user.id] = user;
          })
          commit('setUsers', users);
        });
    },

    /**
     * Loads all puzzle data. Used to bootstrap app.
     * @return {Promise}]
     */
    loadPuzzles: ({ commit, state }) => {
      return axios.get('/puzzles?hide_future=false&order_by=date&dir=asc')
        .then(res => {
          const puzzles = {};
          res.data.forEach((puzzle) => {
            state.puzzleOrder.push(puzzle.id);

            puzzle.outer_letters = parseCharArray(puzzle.outer_letters);
            puzzles[puzzle.id] = puzzle;
          })          
          commit('setPuzzles', puzzles);
        });
    },

    /**
     * Load all user progress data for puzzle. If current user does not have any
     * existing progress data, we create a new entry for them.
     *
     * @type {Promise}
     */
    switchPuzzle: ({ state, commit, dispatch}, data) => {
      commit('setPuzzleId', data);
      commit('clearInput');

      return axios.get(`/puzzles/${state.puzzleId}/users`)
        .then(res => {
          const progressCollection = {};

          // Store existing progress by user id in object
          res.data.forEach(progress => {
            progressCollection[progress.user_id] = progress;
          })
          commit('setPuzzleProgress', progressCollection);

          // If current user has no progress data, create a new obj for them
          if (!has(state.puzzleProgress, state.userId)) {
            return dispatch('createUserPuzzleProgress', {
              puzzleId: data,
              userId: state.userId,
            });
          }
        })
    },

    // eslint-disable-next-line no-empty-pattern
    createUserPuzzleProgress: ({ commit }, data) => {
      const { userId, puzzleId } = data;
      return axios.post(`/puzzles/${puzzleId}/users/${userId}`)
        .then(res => {
          commit('addUserPuzzleProgress', res.data);
        });
    },

    loadProgress: ({ commit }, data) => {
      let progress = {};
      data.forEach(item => {
        progress[item.userid] = item.progress;
      })
      commit('setProgress', progress);
    },

    addFoundWord: ({ state, commit, getters }, word) => {
      commit('pushFoundWord', {
        userId: state.userId,
        word,
      })

      return axios.put(`/puzzles/${state.puzzleId}/users/${state.userId}`, {
        found_words: prepStrArray(getters.foundWords),
      });
    },

    toggleSetting: ({ state, commit, getters }, setting) => {
      const val = getters[setting];

      if (setting === 'teamMode') {
        setting = 'team_mode';
      }

      commit('setSetting', {
        setting,
        value: !val,
      });

      return axios.put(`/puzzles/${state.puzzleId}/users/${state.userId}`, {
        [setting]: !val,
      });
    },
  },
})
