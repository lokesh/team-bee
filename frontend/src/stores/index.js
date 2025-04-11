import { defineStore } from 'pinia'
import axios from '@/axios'
import { calcPoints } from '@/utils'

/**
 * input: '{v,r,t}''
 * output: ['v','r','t']
 * @param  {String} str
 * @return {[String]}
 */
const parseCharArray = (str) => str.replace(/[{}]/g, "").split(',')

/**
 * input ['kiwi', 'melon']
 * output "{kiwi,melon}"
 * @param  {[String]} arr
 * @return {String}
 */
const prepStrArray = (arr) => `{${arr.join()}}`

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array
 * @return {Array}
 */
const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const useStore = defineStore('main', {
  state: () => ({
    showDebugger: false,
    users: {},
    puzzles: {},
    puzzleOrder: [],
    puzzleProgress: {},
    userId: 0,
    puzzleId: 0,
    input: '',
    modal: null,
  }),

  getters: {
    userProgressDataLoaded: (state) => {
      return !!state.puzzleProgress[state.userId]
    },

    user: (state) => {
      return state.users[state.userId] || {}
    },

    puzzle: (state) => {
      return state.puzzles[state.puzzleId] || {}
    },

    puzzleOrderIndex: (state) => {
      return state.puzzleOrder.indexOf(state.puzzleId)
    },

    newestPuzzle: (state) => {
      return state.puzzles[state.puzzleOrder[state.puzzleOrder.length - 1]]
    },

    teamMode: (state) => state.puzzleProgress[state.userId]?.team_mode || false,
    hint: (state) => state.puzzleProgress[state.userId]?.hint || false,
    revealed: (state) => state.puzzleProgress[state.userId]?.revealed || false,
    foundWords: (state) => state.puzzleProgress[state.userId]?.found_words || [],
    teamFoundWords: (state) => {
      const words = []
      Object.values(state.puzzleProgress).forEach(progress => {
        words.push(...progress.found_words)
      })
      return [...new Set(words)]
    },

    letters: (state, getters) => {
      if (!getters.puzzle) return []
      return [getters.puzzle.center_letter, ...getters.puzzle.outer_letters]
    },
    points: (state, getters) => calcPoints(getters.foundWords, getters.letters),
    teamPoints: (state, getters) => calcPoints(getters.teamFoundWords, getters.letters),
    pointsForGenius: (state, getters) => {
      return Math.ceil(getters.possiblePoints * 0.9)
    },
    possiblePoints: (state, getters) => {
      if (!getters.puzzle) return 0
      return calcPoints(getters.puzzle.answers, getters.letters)
    },
  },

  actions: {
    setUserId(userId) {
      console.log('Setting userId:', userId)
      this.userId = userId
      localStorage.setItem('teamBeeUserId', userId)
    },

    clearUser() {
      console.log('Clearing user data')
      this.userId = 0
      localStorage.removeItem('teamBeeUserId')
    },

    setPuzzleId(puzzleId) {
      console.log('Setting puzzleId:', puzzleId)
      this.puzzleId = puzzleId
    },

    shuffleOuterLetters() {
      console.log('Shuffling outer letters')
      if (this.puzzles[this.puzzleId]) {
        this.puzzles[this.puzzleId].outer_letters = shuffleArray(this.puzzles[this.puzzleId].outer_letters)
      }
    },

    addInputLetter(letter) {
      console.log('Adding input letter:', letter)
      this.input = this.input + letter
    },

    clearInput() {
      console.log('Clearing input')
      this.input = ''
    },

    removeInputLetter() {
      console.log('Removing last input letter')
      this.input = this.input.slice(0, -1)
    },

    setInput(input) {
      console.log('Setting input:', input)
      this.input = input
    },

    openModal(modal) {
      console.log('Opening modal:', modal)
      this.modal = modal
    },

    closeModal() {
      console.log('Closing modal')
      this.modal = null
    },

    async loadUsers() {
      console.log('Loading users')
      try {
        const response = await axios.get('/users')
        const users = {}
        response.data.forEach(user => {
          users[user.id] = user
        })
        this.users = users
        console.log('Users loaded successfully:', Object.keys(users).length, 'users')
      } catch (error) {
        console.error('Error loading users:', error)
        throw error
      }
    },

    async loadPuzzles() {
      console.log('Loading puzzles')
      try {
        const response = await axios.get('/puzzles?hide_future=false&order_by=date&dir=asc')
        const puzzles = {}
        response.data.forEach((puzzle) => {
          this.puzzleOrder.push(puzzle.id)
          puzzle.outer_letters = parseCharArray(puzzle.outer_letters)
          puzzles[puzzle.id] = puzzle
        })
        this.puzzles = puzzles
        console.log('Puzzles loaded successfully:', Object.keys(puzzles).length, 'puzzles')
      } catch (error) {
        console.error('Error loading puzzles:', error)
        throw error
      }
    },

    async switchPuzzle(puzzleId) {
      console.log('Switching to puzzle:', puzzleId)
      this.puzzleId = puzzleId
      this.clearInput()

      try {
        const response = await axios.get(`/puzzles/${puzzleId}/users`)
        const progressCollection = {}

        response.data.forEach(progress => {
          progressCollection[progress.user_id] = progress
        })
        this.puzzleProgress = progressCollection
        console.log('Puzzle progress loaded for:', Object.keys(progressCollection).length, 'users')
        console.log(this.puzzleProgress)
        if (!(this.userId in this.puzzleProgress)) {
          console.log('Creating new puzzle progress for user:', this.userId)
          await this.createUserPuzzleProgress(puzzleId)
        }
      } catch (error) {
        console.error('Error switching puzzle:', error)
        throw error
      }
    },

    async createUserPuzzleProgress(puzzleId) {
      console.log('Creating puzzle progress for user:', this.userId, 'puzzle:', puzzleId)
      try {
        const response = await axios.post(`/puzzles/${puzzleId}/users/${this.userId}`)
        this.puzzleProgress[this.userId] = response.data
        console.log('Puzzle progress created successfully')
      } catch (error) {
        console.error('Error creating user puzzle progress:', error)
        throw error
      }
    },

    async addFoundWord(word) {
      console.log('Adding found word:', word)
      this.puzzleProgress[this.userId].found_words.push(word)
      this.puzzleProgress[this.userId].found_words.sort()

      try {
        await axios.put(`/puzzles/${this.puzzleId}/users/${this.userId}`, {
          found_words: prepStrArray(this.puzzleProgress[this.userId].found_words),
        })
        console.log('Word added successfully')
      } catch (error) {
        console.error('Error adding found word:', error)
        throw error
      }
    },

    async toggleSetting(setting) {
      console.log('Toggling setting:', setting)
      const settingKey = setting === 'teamMode' ? 'team_mode' : setting
      const currentValue = this.puzzleProgress[this.userId]?.[settingKey] || false
      
      this.puzzleProgress[this.userId][settingKey] = !currentValue

      try {
        await axios.put(`/puzzles/${this.puzzleId}/users/${this.userId}`, {
          [settingKey]: !currentValue,
        })
        console.log('Setting toggled successfully:', settingKey, 'new value:', !currentValue)
      } catch (error) {
        console.error('Error toggling setting:', error)
        throw error
      }
    },

    async loadProgress(data) {
      console.log('Loading progress data for', data.length, 'users')
      const progress = {}
      data.forEach(item => {
        progress[item.userid] = item.progress
      })
      this.puzzleProgress = progress
      console.log('Progress loaded successfully')
    },
  },
}) 