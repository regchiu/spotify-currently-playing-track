require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node')

const scopes = ['user-read-currently-playing']
const state = 'user-read-playback-state'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.YOUR_CLIENT_ID,
  clientSecret: process.env.YOUR_CLIENT_SECRET,
  redirectUri: process.env.YOUR_REDIRECT_URI,
})

async function printAuthorizeURL() {
  try {
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state)
    console.log(`Your URL is ${authorizeURL}, then paste the entire link into your browser.`)
  } catch (error) {
    console.log(error)
  }
}

printAuthorizeURL()
