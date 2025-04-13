import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/axios'
import { calcPoints } from '@/utils'
import { parseCharArray, prepStrArray, shuffleArray } from '@/utils/array'

export const useStore = defineStore('main', () => {
  // State
  const users = ref({})
  const puzzles = ref({})
  const puzzleOrder = ref([])
  const puzzleProgress = ref({})
  const userId = ref(0)
  const puzzleId = ref(0)
  const input = ref('')
  const modal = ref(null)
  const storeReady = ref(false)

  // Getters
  const userProgressDataLoaded = computed(() => {
    return !!puzzleProgress.value[userId.value]
  })

  const user = computed(() => {
    return users.value[userId.value] || {}
  })

  const puzzle = computed(() => {
    return puzzles.value[puzzleId.value] || {}
  })

  const puzzleOrderIndex = computed(() => {
    return puzzleOrder.value.indexOf(puzzleId.value)
  })

  const newestPuzzle = computed(() => {
    return puzzles.value[puzzleOrder.value[puzzleOrder.value.length - 1]]
  })

  const teamMode = computed(() => puzzleProgress.value?.[userId.value]?.team_mode || false)
  const hint = computed(() => puzzleProgress.value?.[userId.value]?.hint || false)
  const revealed = computed(() => puzzleProgress.value?.[userId.value]?.revealed || false)
  
  const foundWords = computed(() => {
    if (!storeReady.value) return []
    return puzzleProgress.value?.[userId.value]?.found_words || []
  })

  const teamFoundWords = computed(() => {
    if (!puzzleProgress.value) return []
    const words = []
    Object.values(puzzleProgress.value).forEach(progress => {
      if (progress?.found_words) {
        words.push(...progress.found_words)
      }
    })
    return [...new Set(words)]
  })

  const letters = computed(() => {
    if (Object.keys(puzzle.value).length === 0) return []
    return [puzzle.value.center_letter, ...puzzle.value.outer_letters]
  })

  const points = computed(() => {
    if (!storeReady.value) return 0
    const foundWords = puzzleProgress.value?.[userId.value]?.found_words || []
    const letters = puzzles.value[puzzleId.value]?.outer_letters || []
    if (!foundWords.length || !letters.length) return 0
    return calcPoints(foundWords, letters)
  })

  const teamPoints = computed(() => {
    if (!storeReady.value) return 0
    
    const teamWords = []
    if (puzzleProgress.value) {
      Object.values(puzzleProgress.value).forEach(progress => {
        if (progress?.found_words) {
          teamWords.push(...progress.found_words)
        }
      })
    }
    
    const letters = puzzles.value[puzzleId.value]?.outer_letters || []
    if (!teamWords.length || !letters.length) return 0
    return calcPoints([...new Set(teamWords)], letters)
  })

  const pointsForGenius = computed(() => {
    if (!storeReady.value) return 0
    return Math.ceil(possiblePoints.value * 0.9)
  })

  const possiblePoints = computed(() => {
    if (!storeReady.value) return 0
    if (!puzzle.value) return 0
    return calcPoints(puzzle.value.answers, letters.value)
  })

  // Actions
  function setUserId(newUserId) {
    console.log('setUserId', newUserId)
    userId.value = newUserId
    storeReady.value = false
    localStorage.setItem('teamBeeUserId', newUserId)
  }

  function clearUser() {
    userId.value = 0
    storeReady.value = false
    localStorage.removeItem('teamBeeUserId')
  }

  function setPuzzleId(newPuzzleId) {
    puzzleId.value = newPuzzleId
  }

  function shuffleOuterLetters() {
    if (puzzles.value[puzzleId.value]) {
      puzzles.value[puzzleId.value].outer_letters = shuffleArray(puzzles.value[puzzleId.value].outer_letters)
    }
  }

  function addInputLetter(letter) {
    input.value = input.value + letter
  }

  function clearInput() {
    input.value = ''
  }

  function removeInputLetter() {
    input.value = input.value.slice(0, -1)
  }

  function openModal(newModal) {
    modal.value = newModal
  }

  function closeModal() {
    modal.value = null
  }

  async function loadUsers() {
    try {
      const response = await axios.get('/users')
      const usersMap = {}
      response.data.forEach(user => {
        usersMap[user.id] = user
      })
      users.value = usersMap
    } catch (error) {
      throw error
    }
  }

  async function loadPuzzles() {
    try {
      const response = await axios.get('/puzzles?hide_future=false&order_by=date&dir=asc')
      const puzzlesMap = {}
      response.data.forEach((puzzle) => {
        puzzleOrder.value.push(puzzle.id)
        puzzle.outer_letters = parseCharArray(puzzle.outer_letters)
        puzzlesMap[puzzle.id] = puzzle
      })
      puzzles.value = puzzlesMap
    } catch (error) {
      throw error
    }
  }

  async function switchPuzzle(newPuzzleId) {
    storeReady.value = false
    puzzleId.value = newPuzzleId
    clearInput()

    try {
      const response = await axios.get(`/puzzles/${newPuzzleId}/users`)
      const progressCollection = {}
      
      response.data.forEach(progress => {
        progressCollection[progress.user_id] = progress
      })
      
      puzzleProgress.value = progressCollection

      if (!(userId.value in puzzleProgress.value)) {
        await createUserPuzzleProgress(newPuzzleId)
      }

      storeReady.value = true
    } catch (error) {
      storeReady.value = false
      throw error
    }
  }

  async function createUserPuzzleProgress(newPuzzleId) {
    try {
      const response = await axios.post(`/puzzles/${newPuzzleId}/users/${userId.value}`)
      puzzleProgress.value[userId.value] = response.data
    } catch (error) {
      throw error
    }
  }

  async function addFoundWord(word) {
    puzzleProgress.value[userId.value].found_words.push(word)
    puzzleProgress.value[userId.value].found_words.sort()

    try {
      await axios.put(`/puzzles/${puzzleId.value}/users/${userId.value}`, {
        found_words: prepStrArray(puzzleProgress.value[userId.value].found_words),
      })
    } catch (error) {
      throw error
    }
  }

  async function toggleSetting(setting) {
    const settingKey = setting === 'teamMode' ? 'team_mode' : setting
    const currentValue = puzzleProgress.value[userId.value]?.[settingKey] || false
    
    puzzleProgress.value[userId.value][settingKey] = !currentValue

    try {
      await axios.put(`/puzzles/${puzzleId.value}/users/${userId.value}`, {
        [settingKey]: !currentValue,
      })
    } catch (error) {
      throw error
    }
  }

  function loadProgress(data) {
    const progress = {}
    data.forEach(item => {
      progress[item.userid] = item.progress
    })
    puzzleProgress.value = progress
  }

  return {
    // State
    users,
    puzzles,
    puzzleOrder,
    puzzleProgress,
    userId,
    puzzleId,
    input,
    modal,
    storeReady,

    // Getters
    userProgressDataLoaded,
    user,
    puzzle,
    puzzleOrderIndex,
    newestPuzzle,
    teamMode,
    hint,
    revealed,
    foundWords,
    teamFoundWords,
    letters,
    points,
    teamPoints,
    pointsForGenius,
    possiblePoints,

    // Actions
    setUserId,
    clearUser,
    setPuzzleId,
    shuffleOuterLetters,
    addInputLetter,
    clearInput,
    removeInputLetter,
    openModal,
    closeModal,
    loadUsers,
    loadPuzzles,
    switchPuzzle,
    createUserPuzzleProgress,
    addFoundWord,
    toggleSetting,
    loadProgress
  }
}) 