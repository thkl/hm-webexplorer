#!/bin/sh

ADDONNAME=hm-explorer
CONFIG_DIR=/usr/local/etc/config
ADDON_DIR=/usr/local/addons/${ADDONNAME}
ADDONWWW_DIR=/usr/local/etc/config/addons/www
NPMCACHE_DIR=/tmp/${ADDONNAME}-cache
RCD_DIR=${CONFIG_DIR}/rc.d
LOGFILE=/var/log/${ADDONNAME}_install.log
echo "[Installer]Check existency of the daemon" >>${LOGFILE}
#check if we have a package-lock; if not go ahead and call the installer stuff
if [ ! -f ${ADDON_DIR}/server/node_modules/.nobackup ]; then
echo "[Installer]Looks like the daemon is not here so start installer" >>${LOGFILE}
echo "[Installer]Running on node version:" >>${LOGFILE}
node --version >>${LOGFILE}
echo "[Installer]NPM is :" >>${LOGFILE}
npm --version >>${LOGFILE}

echo "[Installer]Program Dir is ${ADDON_DIR}/server" >>${LOGFILE}

echo "[Installer]installing ${ADDONNAME} ...">>${LOGFILE}
#create a cache in /tmp
mkdir ${NPMCACHE_DIR}
cd ${ADDON_DIR}/server
npm i --cache ${NPMCACHE_DIR} >>${LOGFILE}
#remove the cache
rm -R ${NPMCACHE_DIR} 

#create the button in system control
echo "[Installer]creating ${ADDONNAME} Button ...">>${LOGFILE}
node ${ADDON_DIR}/etc/hm_addon.js hme ${ADDON_DIR}/etc/${ADDONNAME}.cfg


echo "[Installer]Adding .nobackup to addon dir ...">>${LOGFILE}
touch ${ADDON_DIR}/server/node_modules/.nobackup
echo "[Installer]we are done ...">>${LOGFILE}
else
echo "[Installer]daemon exists lets light this candle" >>${LOGFILE}
fi