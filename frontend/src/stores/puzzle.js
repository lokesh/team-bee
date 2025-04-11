import { defineStore } from 'pinia'

export const usePuzzleStore = defineStore('puzzle', {
  state: () => ({
    puzzles: [],
    puzzleOrder: [],
    currentPuzzleId: null,
    inputLetters: [],
    foundWords: [],
    teamMode: false,
    outerLetters: []
  }),

  actions: {
    async loadPuzzles() {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/puzzles')
        this.puzzles = await response.json()
        this.puzzleOrder = this.puzzles.map(puzzle => puzzle.id)
      } catch (error) {
        console.error('Error loading puzzles:', error)
      }
    },

    setCurrentPuzzleId(id) {
      this.currentPuzzleId = id
      const puzzle = this.puzzles.find(p => p.id === id)
      if (puzzle) {
        this.outerLetters = [...puzzle.outer_letters]
      }
    },

    addInputLetter(letter) {
      this.inputLetters.push(letter)
    },

    removeInputLetter() {
      this.inputLetters.pop()
    },

    clearInputLetters() {
      this.inputLetters = []
    },

    addFoundWord(word) {
      this.foundWords.push(word)
    },

    shuffleOuterLetters() {
      // Fisher-Yates shuffle algorithm
      for (let i = this.outerLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.outerLetters[i], this.outerLetters[j]] = [this.outerLetters[j], this.outerLetters[i]]
      }
    }
  },

  getters: {
    getPuzzleById: (state) => (id) => {
      return state.puzzles.find(puzzle => puzzle.id === id)
    },

    currentPuzzle: (state) => {
      return state.puzzles.find(puzzle => puzzle.id === state.currentPuzzleId)
    },

    puzzleOrderIndex: (state) => {
      return state.puzzleOrder.indexOf(state.currentPuzzleId)
    }
  }
}) 