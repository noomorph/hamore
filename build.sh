#!/bin/bash

yaml2json>config/hamore.json -p config/hamore.yaml
yaml2json>config/subjects.json -p config/subjects.yaml
yaml2json>config/yehida1.json -p config/yehida1.yaml
yaml2json>config/yehida2.json -p config/yehida2.yaml
handlebars templates/ -f templates/compiled.js
