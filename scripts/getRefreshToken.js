require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node')

const args = process.argv

const providedCode = args.length === 3 && !!args[2] === true

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.YOUR_CLIENT_ID,
  clientSecret: process.env.YOUR_CLIENT_SECRET,
  redirectUri: process.env.YOUR_REDIRECT_URI,
})

if (!providedCode) {
  console.log('Provide the Spotify authorization code.')
  console.log('Usage example:')
  console.log('')
  console.log('npm run get-refresh-token <code>')
  console.log('')
  process.exit(1)
}

const code = args[2]

async function printRefreshToken() {
  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token'])
    spotifyApi.setRefreshToken(data.body['refresh_token'])
    console.log('Your refresh token is: ')
    console.log('')
    console.log(data.body['refresh_token'])
    console.log('')
    console.log(`Copy and paste it into the "YOUR_REFRESH_TOKEN" field.`)
    process.exit(0)
  } catch (error) {
    console.log(error)
  }
}

printRefreshToken()
