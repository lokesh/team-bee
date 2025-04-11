<template>
  <div class="test-page">
    <h1>API Test Page</h1>
    <div class="button-container">
      <h3>Database Connection Test:</h3>
      <button @click="testDbConnection" class="test-button">Test Database Connection</button>
      <h3>Puzzle GET Requests:</h3>
      <button @click="getAllPuzzles" class="test-button">Get All Puzzles</button>
      <button @click="getPuzzleById" class="test-button">Get Puzzle by ID</button>
      <button @click="getPuzzlesByDifficulty" class="test-button">Get Puzzles by Difficulty</button>
      <button @click="getPuzzlesByCategory" class="test-button">Get Puzzles by Category</button>
      <h3>Other Requests:</h3>
      <button @click="testPostRequest" class="test-button">Test POST Request</button>
      <button @click="testPutRequest" class="test-button">Test PUT Request</button>
      <button @click="testDeleteRequest" class="test-button">Test DELETE Request</button>
    </div>
    <div v-if="response" class="response-container">
      <h3>Response:</h3>
      <pre>{{ JSON.stringify(response, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const response = ref(null)
const apiBaseUrl = 'http://localhost:3000' // Backend server port

const testDbConnection = async () => {
  try {
    console.log('Attempting database connection test...')
    console.log('Request URL:', `${apiBaseUrl}/api/test-connection`)
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
    
    const result = await axios.get(`${apiBaseUrl}/api/test-connection`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    console.log('Database Connection Test Response:', {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers,
      data: result.data
    })
    
    response.value = result.data
  } catch (error) {
    console.error('Database Connection Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    })
    response.value = { 
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    }
  }
}

const getAllPuzzles = async () => {
  try {
    const result = await axios.get(`${apiBaseUrl}/api/puzzles`)
    response.value = result.data
    console.log('All Puzzles Response:', result.data)
  } catch (error) {
    console.error('Get All Puzzles Error:', error)
    response.value = { error: error.message }
  }
}

const getPuzzleById = async () => {
  try {
    const puzzleId = 1 // Example ID
    const result = await axios.get(`${apiBaseUrl}/api/puzzles/${puzzleId}`)
    response.value = result.data
    console.log('Puzzle by ID Response:', result.data)
  } catch (error) {
    console.error('Get Puzzle by ID Error:', error)
    response.value = { error: error.message }
  }
}

const getPuzzlesByDifficulty = async () => {
  try {
    const result = await axios.get(`${apiBaseUrl}/api/puzzles`, {
      params: {
        difficulty: 'medium'
      }
    })
    response.value = result.data
    console.log('Puzzles by Difficulty Response:', result.data)
  } catch (error) {
    console.error('Get Puzzles by Difficulty Error:', error)
    response.value = { error: error.message }
  }
}

const getPuzzlesByCategory = async () => {
  try {
    const result = await axios.get(`${apiBaseUrl}/api/puzzles`, {
      params: {
        category: 'logic'
      }
    })
    response.value = result.data
    console.log('Puzzles by Category Response:', result.data)
  } catch (error) {
    console.error('Get Puzzles by Category Error:', error)
    response.value = { error: error.message }
  }
}

const testPostRequest = async () => {
  try {
    const result = await axios.post(`${apiBaseUrl}/api/test`, {
      testData: 'Hello from frontend'
    })
    response.value = result.data
    console.log('POST Response:', result.data)
  } catch (error) {
    console.error('POST Error:', error)
    response.value = { error: error.message }
  }
}

const testPutRequest = async () => {
  try {
    const result = await axios.put(`${apiBaseUrl}/api/test/1`, {
      testData: 'Updated data'
    })
    response.value = result.data
    console.log('PUT Response:', result.data)
  } catch (error) {
    console.error('PUT Error:', error)
    response.value = { error: error.message }
  }
}

const testDeleteRequest = async () => {
  try {
    const result = await axios.delete(`${apiBaseUrl}/api/test/1`)
    response.value = result.data
    console.log('DELETE Response:', result.data)
  } catch (error) {
    console.error('DELETE Error:', error)
    response.value = { error: error.message }
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.button-container {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.test-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.test-button:hover {
  background-color: #45a049;
}

.response-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 