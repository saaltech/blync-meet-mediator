#!/usr/bin/bash
find . -type f -name "*.*" -exec chmod 644 {} +
npm install
make
dpkg-buildpackage -A -rfakeroot -us -uc -tc
