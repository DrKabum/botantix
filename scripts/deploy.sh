#!/usr/bin/bash

sudo apt install upstart
cp scripts/botantix.conf /etc/init/
chmod +x /etc/init/botantix.conf

sudo start botantix