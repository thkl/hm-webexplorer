rm hm-explorer-$(cat VERSION).tar.gz
# build the client angular app
cd ../client
# patch the version
npm --no-git-tag-version version patch
# update VERSION file
node ../addon/version.js
# build the client distribution package
ng build --configuration production

cd ../addon

#create the tmp folders
mkdir -p tmp
rm -rf tmp/*
mkdir -p tmp/hme
mkdir -p tmp/www
mkdir -p tmp/hme/server
mkdir -p tmp/hme/etc

# copy all relevant stuff
cp -a update_script tmp/
cp -a rc.d tmp/hme
cp -a VERSION tmp/www/
#copy the client
cp -a ../client/dist/* tmp/hme
#copy some helpers
cp -a etc tmp/hme

#copy the api server files
cp -a ../server/easymodes tmp/hme/server
cp -a ../server/lib tmp/hme/server
cp -a ../server/locale tmp/hme/server
cp -a ../server/index.js tmp/hme/server
cp -a ../server/package.json tmp/hme/server

# generate archive
cd tmp
tar --exclude=._* --exclude=.DS_Store -czvf ../hm-explorer-$(cat ../VERSION).tar.gz *
cd ..
rm hm-explorer-latest.tar.gz
ln -s hm-explorer-$(cat VERSION).tar.gz hm-explorer-latest.tar.gz
rm -rf tmp
