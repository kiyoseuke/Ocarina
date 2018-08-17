const mix = require('laravel-mix');

mix.setPublicPath('public')
  .ts('resources/assets/ts/bundle.ts', 'public/js')
  .sass('resources/assets/scss/style.scss', 'public/css');