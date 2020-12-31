#!/bin/bash
title=$1
datetime=$(date '+%Y-%m-%dT%H:%M:%S%z')
cat <<EOS > ./posts/$1.md
---
title: "$1"
date: "$datetime"
---


EOS
