import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from 'axios'

const baseUrl = process.env.BASE_URL

const app = express()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.YOUR_CLIENT_ID,
  clientSecret: process.env.YOUR_CLIENT_SECRET,
  redirectUri: process.env.YOUR_REDIRECT_URI,
  refreshToken: process.env.YOUR_REFRESH_TOKEN,
})

app.get('/api', async (_, res) => {
  try {
    const assetsPath: string = path.resolve(__dirname, '../assets')
    const logoSvg: string = readFileSync(path.join(assetsPath, 'spotify_logo_rgb_green.svg'), {
      encoding: 'base64',
    })

    const data = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(data.body['access_token'])
    const currentPlayingTrack = await spotifyApi.getMyCurrentPlayingTrack()

    let externalLink: string = '#'
    let cardImg: string = 'radial-gradient(#222922, #000500)'
    let cardTitle: string = 'No tracks'
    let cardSubtitle: string = ''
    let cardLogoAnimation: string = 'none'
    let cardTitleAnimation: string = 'noise 2s linear infinite'
    let cardSubtitleAnimation: string = 'none'
    let playing: boolean = false

    if (Object.keys(currentPlayingTrack.body).length > 0) {
      if (currentPlayingTrack.body.item) {
        const currentPlayingTrackBodyItem = currentPlayingTrack.body.item as SpotifyApi.TrackObjectFull
        externalLink = currentPlayingTrackBodyItem.album.external_urls.spotify
        const imgUrl = currentPlayingTrackBodyItem.album.images.filter(
          (image) => image.height === 300
        )[0].url

        const response = await axios.get(imgUrl, {
          responseType: 'arraybuffer',
        })

        cardImg = `url(data:image/png;base64,${Buffer.from(response.data, 'binary').toString(
          'base64'
        )})`
        cardTitle = currentPlayingTrackBodyItem.name
        cardSubtitle = currentPlayingTrackBodyItem.artists.map((artist) => artist.name).join(', ')
        cardLogoAnimation = '4s cubic-bezier(.5, 0, .5, 1.2) 1s infinite bounce'
        cardTitleAnimation = cardTitle.length > 10 ? `marquee ${cardTitle.length * 0.5}s linear infinite alternate` : 'none'
        cardSubtitleAnimation = cardSubtitle.length > 10 ? `marquee ${cardSubtitle.length * 0.5}s linear infinite alternate` : 'none'
        playing = true
      }
    }

    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(`<svg fill="none" viewBox="0 0 300 150" width="300" height="150" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
            * {
              box-sizing: border-box;
            }

            .external-link {
              text-decoration: none;
              display: flex;
              width: 300px;
              height: 150px;
            }

            .card {
              display: flex;
              flex: 1;
              box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
              border-radius: 4px;
            }

            .card__img {
              background-image: ${cardImg};
              background-repeat: no-repeat;
              background-size: cover;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
              background-position: center;
              z-index: 10;
              width: 150px;
            }

            .card__body {
              background-color: #000000;
              display: flex;
              flex-direction: column;
              align-items: center;
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
              gap: 8px;
              width: 150px;
            }

            .card__logo {
              flex: 1;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .card__logo > img {
              transform-origin: bottom;
              animation: ${cardLogoAnimation};
              width: 100px;
              height: 50px;
              object-fit: contain;
            }

            .card__title {
              flex: 1;
              font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif;
              color: #ffffff;
              white-space: nowrap;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            }

            .card__title > span {
              animation: ${cardTitleAnimation};
            }
            
            .card__subtitle {
              flex: 1;
              font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif;
              color: #ffffff;
              white-space: nowrap;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            }

            .card__subtitle > span {
              animation: ${cardSubtitleAnimation};
            }

            .overlay {
              background-image: linear-gradient(transparent 0%, rgba(30, 215, 96, 0.1) 50%);
              background-size: 150px 2px;
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
            
            @keyframes marquee {
              0% {
                transform: translateX(55%);
              }
              100% {
                transform: translateX(-55%);
              }
            }
          </style>
          <a class="external-link" href="${externalLink}" target="_blank">
            <div class="card">
              <div class="card__img"></div>
              <div class="card__body">
                <div class="card__logo">
                  <img src="data:image/svg+xml;base64,${logoSvg}" />
                </div>
                <div class="card__title">
                  <span><![CDATA[${cardTitle}]]></span>
                </div>
                <div class="card__subtitle">
                  <span><![CDATA[${cardSubtitle}]]></span>
                </div>
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
