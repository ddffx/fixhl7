#!/usr/bin/env node
'use strict';
const meow = require('meow');
const processHL7Cli = require('.');

const cli = meow(`
    Usage: Fix HL7 messages

    $ ./cli.js fix-chars 
    $ ./cli.js append-hl7
    Options
      --in-dir
      
    Example: 
      Step 1: ./cli.js fix-chars --in-dir /data/src
      Step 2: ./cli.js append-hl7 --in-dir /data/src
`)

processHL7Cli(cli.input[0], cli.flags);
