FROM seotaro/ubuntu-ffmpeg as ffmpeg-builder

FROM ubuntu:20.04 as app

COPY --from=ffmpeg-builder /root/bin/ffmpeg /usr/local/bin/
COPY --from=ffmpeg-builder /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu

RUN apt-get update -qq \
   && apt-get install -y curl \
   && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
   && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
   && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
   && apt-get update -qq \
   && apt-get install -y nodejs yarn \
   && apt-get -y clean \
   && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package*.json ./
RUN yarn install
COPY rec-radiko.js ./
COPY rec-nhk-on-demand.js ./
COPY utils.js ./
