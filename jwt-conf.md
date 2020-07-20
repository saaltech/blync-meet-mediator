Jitsi JWT Token Configudation on Ubuntu 20.04
==================

## Prerequisite

    * Jitsi installed on Ubuntu 20.04
    * configured jitsi Secure Domain setup

## JWT Configuration Steps

    Installing token plugin

    - apt-get install jitsi-meet-tokens
        - this step will ask appid and appsecret

    Patching Prosody
    
    - wget https://packages.prosody.im/debian/pool/main/p/prosody-trunk/prosody-trunk_1nightly747-1~trusty_amd64.deb
