# Activate Headless Display (Xvfb)
sudo apt-get update
sudo apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev
sudo apt install -y libappindicator1 fonts-liberation libasound2
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb

sudo Xvfb -ac :99 -screen 0 1280x1024x16 > /dev/null 2>&1 &
export DISPLAY=:99
exec "$@"
