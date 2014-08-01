#!/bin/bash

yaml2json -p -s config/
yaml2json -p -s lessons/
node>lessons/index.json indexer.js lessons

handlebars templates/ -f templates/compiled.js
