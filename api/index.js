require('dotenv').config()
const { readFileSync } = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const baseUrl = process.env.BASE_URL

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.YOUR_CLIENT_ID,
  clientSecret: process.env.YOUR_CLIENT_SECRET,
  redirectUri: process.env.YOUR_REDIRECT_URI,
  refreshToken: process.env.YOUR_REFRESH_TOKEN,
})

app.get('/api', async (req, res) => {
  try {
    const assetsPath = path.resolve(__dirname, '../assets')
    const logoSvg = readFileSync(path.join(assetsPath, 'logo.svg'), { encoding: 'base64' })

    const data = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(data.body['access_token'])
    const currentPlayingTrack = await spotifyApi.getMyCurrentPlayingTrack()

    let externalLink = '#'
    let cardImg = 'radial-gradient(#222922, #000500)'
    let cardTitle = 'No tracks'
    let cardSubtitle = ''
    let cardLogoAnimation = 'none'
    let cardTitleAnimation = 'noise 2s linear infinite'
    let playing = false

    if (Object.keys(currentPlayingTrack.body).length > 0) {
      if (currentPlayingTrack.body.item) {
        externalLink = currentPlayingTrack.body.item.album.external_urls.spotify
        const imgUrl = currentPlayingTrack.body.item.album.images.filter(
          (image) => image.height === 300
        )[0].url

        const response = await axios.get(imgUrl, {
          responseType: 'arraybuffer',
        })

        cardImg = `url(data:image/png;base64,${Buffer.from(response.data, 'binary').toString(
          'base64'
        )})`
        cardTitle = currentPlayingTrack.body.item.name
        cardSubtitle = currentPlayingTrack.body.item.artists[0].name
        cardLogoAnimation = '4s cubic-bezier(.5, 0, .5, 1.2) 1s infinite bounce'
        cardTitleAnimation = 'none'
        playing = true
      }
    }

    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(`<svg fill="none" viewBox="0 0 500 250" width="500" height="250" xmlns="http://www.w3.org/2000/svg">
<foreignObject width="100%" height="100%">
  <div xmlns="http://www.w3.org/1999/xhtml">
    <style>
      .external-link {
        text-decoration: none;
      }

      .card {
        width: 500px;
        height: 250px;
        display: flex;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
        border-radius: 4px;
      }

      .card__img {
        width: 250px;
        height: 250px;
        background-image: ${cardImg};
        background-repeat: no-repeat;
        background-size: contain;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background-position: center;
      }

      .card__body {
        background-color: #000000;
        width: 250px;
        height: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .card__logo {
        width: 100px;
        height: 50px;
        transform-origin: bottom;
        animation: ${cardLogoAnimation};
      }

      .card__title {
        font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
        color: #ffffff;
        width: 250px;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        animation: ${cardTitleAnimation};
      }
      
      .card__subtitle {
        font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif;
        color: #ffffff;
        width: 250px;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }

      .overlay {
        background-image: linear-gradient(transparent 0%, rgba(30, 215, 96, 0.1) 50%);
        background-size: 250px 2px;
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
      }

      @keyframes bounce {
        0% {
          transform: scale(1, 1) translateY(0) skew(0deg, 0deg);
        }

        3% {
          transform: scale(1, 1) translateY(0) skew(0deg, 0deg);
        }

        5% {
          transform: scale(1.1, .9) translateY(5px) skew(0deg, 0deg);
        }

        12% {
          transform: scale(.9, 1.1) translateY(-35px) skew(25deg, 5deg);
        }

        13% {
          transform: scale(.9, 1.1) translateY(-35px) skew(25deg, 5deg);
        }

        20% {
          transform: scale(1.05, .95) translateY(0) skew(0deg, 0deg);
        }

        22% {
          transform: scale(1, 1) translateY(-7px) skew(0deg, 0deg);
        }

        27% {
          transform: scale(1, 1) translateY(0) skew(0deg, 0deg);
        }

        100% {
          transform: scale(1, 1) translateY(0) skew(0deg, 0deg);
        }
      }

      @keyframes noise {
        0%, 3%, 5%, 42%, 44%, 63%, 65%, 92%, 94%, 100% {
          opacity: 1;
          transform: scaleY(1);
        }
        4.3% {
          opacity: 1;
          transform: scaleY(4);
        }
        43% {
          opacity: 1;
          transform: scaleX(10) rotate(60deg);
        }
        64.3% {
          opacity: 1;
          transform: scaleY(4);
        }
        93% {
          opacity: 1;
          transform: scaleX(20) rotate(-60deg);
        }
      }
    </style>
    <a class="external-link" href="${externalLink}" target="_blank">
      <div class="card">
        <div class="card__img"></div>
        <div class="card__body">
          <img class="card__logo" src="data:image/svg+xml;base64,${logoSvg}" />
          <div class="card__title"><![CDATA[${cardTitle}]]></div>
          <div class="card__subtitle"><![CDATA[${cardSubtitle}]]></div>
        </div>
        <div class="${playing ? '' : 'overlay'}"></div>
      </div>
    </a>
  </div>
</foreignObject>
</svg>`)
    res.end()
  } catch (error) {
    console.error(JSON.stringify(error))
  }
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log(`Server running at ${baseUrl}/api`)
  })
}

module.exports = app
