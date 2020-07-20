Jitsi JWT token configuration on Ubuntu 20.04
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
- sudo dpkg -i prosody-trunk_1nightly747-1~trusty_amd64.deb
    - dpkg: dependency problems prevent configuration of prosody-trunk:
        prosody-trunk depends on lua5.1; however:
        Package lua5.1 is not installed.
        prosody-trunk depends on libssl1.0.0 (>= 1.0.0); however:
        Package libssl1.0.0 is not installed.

Update libssl to libssl1.0.0 (>= 1.0.0); 

- echo "deb http://security.ubuntu.com/ubuntu bionic-security main" | sudo tee -a /etc/apt/sources.list.d/bionic.list
```  
     sudo apt update
     apt-cache policy libssl1.0-dev
     sudo apt-get install libssl1.0-dev
     apt --fix-broken install
     sudo apt-get install libssl1.0-dev
```

Install prosody-trunk_1nightly747-1~trusty_amd64.deb again
- sudo dpkg -i prosody-trunk_1nightly747-1~trusty_amd64.deb

Upgrade to  prosody-trunk_1nightly1074-1~bionic_amd64.deb
- wget https://packages.prosody.im/debian/pool/main/p/prosody-trunk/prosody-trunk_1nightly1074-1~bionic_amd64.deb
- dpkg -i prosody-trunk_1nightly1074-1~bionic_amd64.deb

Following changes in  /etc/prosody/prosody.cfg.lua 

- add following line to end 
``` 
Include "conf.d/*.cfg.lua"
```
- client to server encryption is not enforced
``` 
c2s_require_encryption=false
```