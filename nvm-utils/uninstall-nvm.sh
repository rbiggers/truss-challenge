#!/bin/bash

echo "Removing NVM environment variable.."
unset NVM_DIR
cp ~/.bashrc ~/.bashrc.orig
mv ~/.bashrc ~/.bashrc.bkup
sed "\:NVM_DIR:d" ~/.bashrc.bkup > ~/.bashrc
if [ $? -eq 0 ]; then
  echo "Done"
else
  echo "=> Failed to remove environment variable NVM_DIR" >&2
  exit
fi

echo "Sourcing Bash"
. ~/.bashrc
echo "Done"

echo "Removing NVM & NodeJs"
rm -rf $NVM_DIR ~/.npm ~/.nmprc ~/.nvm ~/.bower
sudo rm -rf $NVM_DIR ~/.npm ~/.npmrc ~/.nvm ~/.bower
echo "Done"