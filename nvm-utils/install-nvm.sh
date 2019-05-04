#!/bin/bash

NVM_VER="v0.34.0"
NODE_VER="v10.15.0"
NVM_SHELL=~/.nvm/nvm.sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

if [ -f "$NVM_SHELL" ]; then
  echo "Sourcing nvm.sh..."
  . ~/.nvm/nvm.sh
  . ~/.bashrc
  echo "Done"
else
    echo "Sourcing bashrc..."
  . ~/.bashrc
    echo "Done"
fi

if ! [ -n "$(nvm --version)" ]; then
  echo "Installing Node version manager (http://nvm.sh)." >&2
  wget -qO- https://raw.githubusercontent.com/creationix/nvm/$NVM_VER/install.sh | bash
  
  if ! [ $? -eq 0 ]; then
  echo "=> NVM install failed" >&2
  exit
  fi

else
  echo "=> NVM version $(nvm --version) is already installed" >&2
fi

if [ -f "$NVM_SHELL" ]; then
  echo "Sourcing nvm.sh..."
  source ~/.nvm/nvm.sh
  source ~/.bashrc
  echo "Done"
else
    echo "Sourcing bashrc..."
  . ~/.bashrc
    echo "Done"
fi

if ! [ -n "$(node -v)" ]; then
  echo "Installing NodeJs"
  nvm install $NODE_VER
  if ! [ $? -eq 0 ]; then
    echo "=> NodeJs install failed" >&2
    exit
  fi
  echo "Done"
else
  echo "=> NodeJs version $(node -v) is already installed" >&2
fi