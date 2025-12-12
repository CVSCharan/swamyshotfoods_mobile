#!/bin/bash

# Script to download and setup fonts for Swamy's Hot Foods app

echo "📥 Downloading fonts for Swamy's Hot Foods..."

# Create fonts directory
mkdir -p assets/fonts

# Download Playfair Display
echo "Downloading Playfair Display..."
curl -L "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Regular.ttf" -o "assets/fonts/PlayfairDisplay-Regular.ttf"
curl -L "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-SemiBold.ttf" -o "assets/fonts/PlayfairDisplay-SemiBold.ttf"
curl -L "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Bold.ttf" -o "assets/fonts/PlayfairDisplay-Bold.ttf"

# Download Inter
echo "Downloading Inter..."
curl -L "https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf" -o "assets/fonts/Inter-Regular.ttf"
curl -L "https://github.com/google/fonts/raw/main/ofl/inter/Inter-Medium.ttf" -o "assets/fonts/Inter-Medium.ttf"
curl -L "https://github.com/google/fonts/raw/main/ofl/inter/Inter-SemiBold.ttf" -o "assets/fonts/Inter-SemiBold.ttf"
curl -L "https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf" -o "assets/fonts/Inter-Bold.ttf"

echo "✅ Fonts downloaded successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npx react-native-asset"
echo "2. Update src/theme/paperTheme.ts (see custom-fonts-guide.md)"
echo "3. Rebuild: cd android && ./gradlew clean && cd .. && npx react-native run-android"
