#!/bin/sh
# This script checks if the changelogs was modified correctly.

git diff origin/master -- doc/changelog.md | grep -E "^\+.+_\(.+\)_"
if [ $? != "0" ]; then
	echo "The Changelog was not extended correctly."
	echo "Please make sure you add at least one line describing your contribution followed"
	echo "by the text _(your name)_."
	echo ""
	echo "For example, if Sandra Power fixed a typo, she adds to doc/changelog.md:"
	echo "- typo fixed _(Sandra Power)_"
	echo ""
	echo "Similar contributions might be summarized shortly before the release."
	exit 1
fi
