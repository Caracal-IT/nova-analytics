#!/bin/bash
# Publish the latest version of the workflow

echo Start Build
ng build
echo Build Completed

echo Start Packaging
npm run packagr
echo End Packaging

echo Start Creating Bundel
cd dist
npm pack
echo End Creating Bundel

echo Start Publish Bundel
cp *.tgz ../../../../Packages
echo End Publish Bundel
cd ..

