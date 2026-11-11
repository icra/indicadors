#!/bin/bash

#git
git add *
git commit -m "update"
git push

#desplega al servidor
# -h  human readable format
# -P  mostra progrés
# -vv incrementa verbositat
# -r  actua recursivament
rsync -hPvr \
  --exclude ".git" \
  --exclude "querys-openalex-guardades/" \
  . root@icra.loading.net:/var/www/vhosts/icradev.cat/indicadors.icradev.cat
