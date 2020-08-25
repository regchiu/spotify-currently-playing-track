# spotify-currently-playing-track

## Overview

![](https://spotify-currently-playing-track.vercel.app/api)

### How to use

#### 1. Go to [Spotify Dashboard](https://developer.spotify.com/dashboard/) create an app.

1. Go **edit settings** and add **Redirect URIs**. 
i.e. White-listed addresses to redirect to after authentication success OR failure (e.g. http://mysite.com/callback/)

2. Rename `.env.example` to `.env` file.
    Copy **Redirect URIs**, **Client ID**, **Client Secret** and paste into `YOUR_REDIRECT_URI` ,`YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` field.

#### 2. Installation

```
$ npm install
```
#### 3. Get Authorize URL

```
$ npm run get-authorize-url
```
Paste the entire link into your browser and copy the url query string named **"code"**.

#### 4. Get Refresh Token

```
$ npm get-refresh-token <code>
```

Copy and paste it into the `YOUR_REFRESH_TOKEN` field.

#### 5. Run start

```
$ npm run start
```

### Deploy on your Vercel

1. [Sign in](https://vercel.com/login) with GitHub by Continue with GitHub.

   ![Sign in](https://raw.githubusercontent.com/regchiu/resources/master/spotify-currently-playing-track/log_in_to_vercel.jpg)

2. Fork this repo.

3. [Import project](https://vercel.com/import) and select **Import Git Repository**.

    ![Import Project](https://raw.githubusercontent.com/regchiu/resources/master/spotify-currently-playing-track/import_project_vercel.jpg)

    Allow access to your repository, if prompted.

4. Select root and keep everything default, then add `YOUR_REFRESH_TOKEN`, `YOUR_CLIENT_SECRET` and `YOUR_CLIENT_ID` of **Environment Variables**.

    ![Import Project Settings](https://raw.githubusercontent.com/regchiu/resources/master/spotify-currently-playing-track/import_project_settings_vercel.jpg)

5. Click deploy, and see your domains to use the API! enjoy! :tada:

