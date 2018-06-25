# hypertube

# Getting started

## ffmpeg

You need to have ffmpeg and ffprobe installed and in your path. Here's the version used by yours truly: 

```
ffmpeg version 4.0-tessus Copyright (c) 2000-2018 the FFmpeg developers
  built with Apple LLVM version 9.1.0 (clang-902.0.39.1)
  configuration: --cc=/usr/bin/clang --prefix=/opt/ffmpeg --extra-version=tessus --enable-avisynth --enable-fontconfig --enable-gpl --enable-libass --enable-libbluray --enable-libfreetype --enable-libgsm --enable-libmodplug --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopus --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libtheora --enable-libvidstab --enable-libvo-amrwbenc --enable-libvorbis --enable-libvpx --enable-libwavpack --enable-libx264 --enable-libx265 --enable-libxavs --enable-libxvid --enable-libzimg --enable-libzmq --enable-libzvbi --enable-version3 --pkg-config-flags=--static --disable-ffplay
  libavutil      56. 14.100 / 56. 14.100
  libavcodec     58. 18.100 / 58. 18.100
  libavformat    58. 12.100 / 58. 12.100
  libavdevice    58.  3.100 / 58.  3.100
  libavfilter     7. 16.100 /  7. 16.100
  libswscale      5.  1.100 /  5.  1.100
  libswresample   3.  1.100 /  3.  1.100
  libpostproc    55.  1.100 / 55.  1.100
```

Pretty much any version with HLS support should do, be careful to have support for the audio/video codecs you like.

## Database
You may need mongodb services started (use brew it's so simple !)
```
brew services start mongodb
```

## Environment
You can use both npm or yarn, the versions I used to create this project are:
```
node -v; npm -v; yarn -v
v9.3.0
5.5.1
1.3.2
```

## Installation

```
# With npm
npm install
cd client
npm install
cd ..

# With yarn
yarn install
cd client
yarn install
cd ..
```

## Development

```
# With npm
npm run start-dev

# With yarn
yarn start-dev
```
