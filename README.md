## Build
Execute `bundle exec jekyll build`

## Serving locally
Execute `bundle exec jekyll serve`

The `_site` directory contains a separate repo that pushes to github pages.
Think of this like you would the `www/` directory on a static content provider.

This repo has `_site` in its `.gitignore`. It's the output of jekyll.

## Deploying
Making a commit outside of `blog/_site` will simply make a change to the source repo.
Making a commit inside of `blog/_site` will update the deployed site on github pages.
