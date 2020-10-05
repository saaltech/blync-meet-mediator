# Stage 1, "dpkg-stage"
# scr.saal.ai/saal-meeting-base:1 from base.dockerfile
FROM scr.saal.ai/saal-meeting-base:latest as dpkg-package
RUN mkdir /saal-repo
RUN mkdir /saal-repo/saal-meeting
ADD . /saal-repo/saal-meeting/
WORKDIR /saal-repo/saal-meeting
RUN find . -type f -name "*.*" -exec chmod 644 {} +
# RUN npm cache clean -f
RUN apt-get update && apt install -y git make
RUN npm install --registry https://npr.saal.ai
RUN make
RUN apt-get update && apt install -y nodejs build-essential debhelper
RUN dpkg-buildpackage -A -rfakeroot -us -uc -tc

# Stage 2, "web stage"
FROM scr.saal.ai/jitsi-base:latest

ADD https://dl.eff.org/certbot-auto /usr/local/bin/

COPY rootfs/ /

WORKDIR /saal-web-repo
COPY --from=dpkg-package /saal-repo/jitsi-meet-web-config_*.deb ./
COPY --from=dpkg-package /saal-repo/jitsi-meet-web_*.deb ./

RUN \
  apt-get update && \
	apt-get install -y cron nginx-extras && \
	apt-get -d install -y ./jitsi-meet-web-config_*.deb && \
	apt-get install -y ./jitsi-meet-web_*.deb && \
  dpkg -x ./jitsi-meet-web-config_*.deb /jitsi-meet-web-config && \
  cp /jitsi-meet-web-config/usr/share/jitsi-meet-web-config/config.js /defaults && \
	cp /usr/share/jitsi-meet/interface_config.js /defaults && \
  rm -rf /var/lib/apt/lists/ && \
	rm -f /etc/nginx/conf.d/default.conf && \
	rm -rf /var/cache/apt && \
  rm ./jitsi-meet-web*.deb && \
  rm -rf /jitsi-meet-web-config

RUN \
	chmod a+x /usr/local/bin/certbot-auto && \
	certbot-auto --noninteractive --install-only

EXPOSE 80 443

VOLUME ["/config", "/etc/letsencrypt", "/usr/share/jitsi-meet/transcripts"]