import { defineStore } from 'pinia'
import axios from '@/axios'
import { calcPoints } from '@/utils'
import { parseCharArray, prepStrArray, shuffleArray } from '@/utils/array'

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
    isLoading: false,
    isReady: false,
    storeReady: false
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

    teamMode: (state) => state.puzzleProgress?.[state.userId]?.team_mode || false,
    hint: (state) => state.puzzleProgress?.[state.userId]?.hint || false,
    revealed: (state) => state.puzzleProgress?.[state.userId]?.revealed || false,
    
    foundWords: (state) => {
      if (!state.storeReady) return []
      return state.puzzleProgress?.[state.userId]?.found_words || []
    },

    teamFoundWords: (state) => {
      if (!state.puzzleProgress) return []
      const words = []
      Object.values(state.puzzleProgress).forEach(progress => {
        if (progress?.found_words) {
          words.push(...progress.found_words)
        }
      })
      return [...new Set(words)]
    },

    letters: (state, getters) => {
      if (!getters.puzzle) return []
      return [getters.puzzle.center_letter, ...getters.puzzle.outer_letters]
    },

    points: (state) => {
      if (!state.storeReady) return 0
      const foundWords = state.puzzleProgress?.[state.userId]?.found_words || []
      const letters = state.puzzles[state.puzzleId]?.outer_letters || []
      if (!foundWords.length || !letters.length) return 0
      return calcPoints(foundWords, letters)
    },

    teamPoints: (state) => {
      if (!state.storeReady) return 0
      
      const teamWords = []
      if (state.puzzleProgress) {
        Object.values(state.puzzleProgress).forEach(progress => {
          if (progress?.found_words) {
            teamWords.push(...progress.found_words)
          }
        })
      }
      
      const letters = state.puzzles[state.puzzleId]?.outer_letters || []
      if (!teamWords.length || !letters.length) return 0
      return calcPoints([...new Set(teamWords)], letters)
    },

    pointsForGenius: (state, getters) => {
      if (!state.storeReady) return 0
      return Math.ceil(getters.possiblePoints * 0.9)
    },

    possiblePoints: (state, getters) => {
      if (!state.storeReady) return 0
      if (!getters.puzzle) return 0
      return calcPoints(getters.puzzle.answers, getters.letters)
    }
  },

  actions: {
    setUserId(userId) {
      this.userId = userId
      this.isReady = false
      this.storeReady = false
      localStorage.setItem('teamBeeUserId', userId)
    },

    clearUser() {
      this.userId = 0
      this.isReady = false
      this.storeReady = false
      localStorage.removeItem('teamBeeUserId')
    },

    setPuzzleId(puzzleId) {
      this.puzzleId = puzzleId
    },

    shuffleOuterLetters() {
      if (this.puzzles[this.puzzleId]) {
        this.puzzles[this.puzzleId].outer_letters = shuffleArray(this.puzzles[this.puzzleId].outer_letters)
      }
    },

    addInputLetter(letter) {
      this.input = this.input + letter
    },

    clearInput() {
      this.input = ''
    },

    removeInputLetter() {
      this.input = this.input.slice(0, -1)
    },

    setInput(input) {
      this.input = input
    },

    openModal(modal) {
      this.modal = modal
    },

    closeModal() {
      this.modal = null
    },

    async loadUsers() {
      try {
        const response = await axios.get('/users')
        const users = {}
        response.data.forEach(user => {
          users[user.id] = user
        })
        this.users = users
      } catch (error) {
        throw error
      }
    },

    async loadPuzzles() {
      try {
        const response = await axios.get('/puzzles?hide_future=false&order_by=date&dir=asc')
        const puzzles = {}
        response.data.forEach((puzzle) => {
          this.puzzleOrder.push(puzzle.id)
          puzzle.outer_letters = parseCharArray(puzzle.outer_letters)
          puzzles[puzzle.id] = puzzle
        })
        this.puzzles = puzzles
      } catch (error) {
        throw error
      }
    },

    async switchPuzzle(puzzleId) {
      this.isLoading = true
      this.isReady = false
      this.storeReady = false
      this.puzzleId = puzzleId
      this.clearInput()

      try {
        const response = await axios.get(`/puzzles/${puzzleId}/users`)
        const progressCollection = {}
        
        response.data.forEach(progress => {
          progressCollection[progress.user_id] = progress
        })
        
        this.puzzleProgress = progressCollection

        if (!(this.userId in this.puzzleProgress)) {
          await this.createUserPuzzleProgress(puzzleId)
        }

        this.isReady = true
        this.storeReady = true
      } catch (error) {
        this.isReady = false
        this.storeReady = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createUserPuzzleProgress(puzzleId) {
      try {
        const response = await axios.post(`/puzzles/${puzzleId}/users/${this.userId}`)
        this.puzzleProgress[this.userId] = response.data
      } catch (error) {
        throw error
      }
    },

    async addFoundWord(word) {
      this.puzzleProgress[this.userId].found_words.push(word)
      this.puzzleProgress[this.userId].found_words.sort()

      try {
        await axios.put(`/puzzles/${this.puzzleId}/users/${this.userId}`, {
          found_words: prepStrArray(this.puzzleProgress[this.userId].found_words),
        })
      } catch (error) {
        throw error
      }
    },

    async toggleSetting(setting) {
      const settingKey = setting === 'teamMode' ? 'team_mode' : setting
      const currentValue = this.puzzleProgress[this.userId]?.[settingKey] || false
      
      this.puzzleProgress[this.userId][settingKey] = !currentValue

      try {
        await axios.put(`/puzzles/${this.puzzleId}/users/${this.userId}`, {
          [settingKey]: !currentValue,
        })
      } catch (error) {
        throw error
      }
    },

    async loadProgress(data) {
      const progress = {}
      data.forEach(item => {
        progress[item.userid] = item.progress
      })
      this.puzzleProgress = progress
    },
  },
}) 