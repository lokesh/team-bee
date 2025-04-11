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
      console.log('Accessing foundWords:', {
        userId: state.userId,
        hasProgress: !!state.puzzleProgress,
        hasUserProgress: !!state.puzzleProgress?.[state.userId],
        foundWords: state.puzzleProgress?.[state.userId]?.found_words,
        isReady: state.isReady,
        storeReady: state.storeReady
      })
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
      console.log('Calculating points:', {
        storeReady: state.storeReady,
        foundWords: state.puzzleProgress?.[state.userId]?.found_words,
        letters: state.puzzles[state.puzzleId]?.outer_letters,
        isLoading: state.isLoading,
        isReady: state.isReady
      })
      if (!state.storeReady) return 0
      const foundWords = state.puzzleProgress?.[state.userId]?.found_words || []
      const letters = state.puzzles[state.puzzleId]?.outer_letters || []
      if (!foundWords.length || !letters.length) return 0
      return calcPoints(foundWords, letters)
    },

    teamPoints: (state) => {
      console.log('Calculating team points:', {
        storeReady: state.storeReady,
        hasProgress: !!state.puzzleProgress,
        isLoading: state.isLoading,
        isReady: state.isReady
      })
      if (!state.storeReady) return 0
      
      // Get team words directly from state
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
      console.log('Setting userId:', userId)
      this.userId = userId
      this.isReady = false
      this.storeReady = false
      localStorage.setItem('teamBeeUserId', userId)
    },

    clearUser() {
      console.log('Clearing user data')
      this.userId = 0
      this.isReady = false
      this.storeReady = false
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
      console.log('Starting puzzle switch:', puzzleId)
      this.isLoading = true
      this.isReady = false
      this.storeReady = false
      this.puzzleId = puzzleId
      this.clearInput()

      try {
        console.log('Fetching puzzle progress for:', puzzleId)
        const response = await axios.get(`/puzzles/${puzzleId}/users`)
        const progressCollection = {}
        
        response.data.forEach(progress => {
          progressCollection[progress.user_id] = progress
        })
        
        console.log('Setting puzzle progress:', {
          userId: this.userId,
          hasProgress: !!progressCollection[this.userId],
          totalUsers: Object.keys(progressCollection).length,
          isReady: this.isReady,
          storeReady: this.storeReady
        })
        
        this.puzzleProgress = progressCollection

        if (!(this.userId in this.puzzleProgress)) {
          console.log('Creating new puzzle progress for user:', this.userId)
          await this.createUserPuzzleProgress(puzzleId)
        }

        this.isReady = true
        this.storeReady = true
        console.log('Store is now ready:', {
          isReady: this.isReady,
          storeReady: this.storeReady,
          userId: this.userId,
          puzzleId: this.puzzleId,
          hasProgress: !!this.puzzleProgress
        })
      } catch (error) {
        console.error('Error switching puzzle:', error)
        this.isReady = false
        this.storeReady = false
        throw error
      } finally {
        this.isLoading = false
        console.log('Completed puzzle switch:', puzzleId)
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