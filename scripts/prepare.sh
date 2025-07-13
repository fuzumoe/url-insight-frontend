#!/bin/bash
# Script to install NVM and set up a newer Node.js version

echo "Installing NVM (Node Version Manager)..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM in the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Verify NVM installation
echo "Verifying NVM installation..."
if command -v nvm &> /dev/null; then
    echo "✅ NVM installed successfully: $(nvm --version)"
else
    echo "❌ NVM installation failed. Please check for errors above."
    exit 1
fi

# Install Node.js LTS version
echo "Installing Node.js LTS version..."
nvm install --lts

# Set as default
echo "Setting LTS version as default..."
nvm alias default 'lts/*'

# Verify Node.js version
echo "Verifying Node.js version..."
node -v
npm -v

# Return to project directory and reinstall dependencies