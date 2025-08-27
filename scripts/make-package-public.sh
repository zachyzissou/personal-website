#!/bin/bash

# Script to make GitHub Container Registry package public
# This allows unauthenticated docker pulls

echo "🔧 Making GitHub Container Registry package public..."

REPO_OWNER="zachyzissou"
PACKAGE_NAME="personal-website"

echo "📦 Package: ghcr.io/${REPO_OWNER}/${PACKAGE_NAME}"
echo ""
echo "To make this package public, you need to:"
echo "1. Go to: https://github.com/users/${REPO_OWNER}/packages/container/${PACKAGE_NAME}/settings"
echo "2. Or go to: https://github.com/${REPO_OWNER}/${PACKAGE_NAME}/pkgs/container/${PACKAGE_NAME}"
echo "3. Scroll down to 'Danger Zone'"
echo "4. Click 'Change visibility'"
echo "5. Select 'Public'"
echo "6. Type the package name to confirm"
echo ""
echo "Alternatively, you can use the GitHub API:"
echo "gh api --method PATCH /user/packages/container/${PACKAGE_NAME} --field visibility=public"
echo ""
echo "⚠️  Note: This requires admin access to the repository/package"
echo ""
echo "Once public, the following will work without authentication:"
echo "docker pull ghcr.io/${REPO_OWNER}/${PACKAGE_NAME}:latest"