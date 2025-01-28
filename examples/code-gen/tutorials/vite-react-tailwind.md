# Tutorial for configuring React project using vite that uses tailwind css
Follow this guide for creating a react project using vite that uses tailwind

## Step 1: Creating the project using vite
Run command npm create vite@latest yourProjectName --yes -- --template react

## Step 2: Add tailwindcss plugin to vite.config.ts
1. import the tailwindcss from '@tailwindcss/vite'
2. Add tailwindcss() to the plugins array of vite.config.ts

## Step 3: Import Tailwind CSS in your styles
Import the tailwind css to the root css file using @import "tailwindcss";
Remember that old tailwind has changed and you must NOT use @import 'tailwindcss/tailwind.css';

## What you must not do
1. Donot use postcss.
2. Donot @import 'tailwindcss/tailwind.css'; Instead use @import "tailwindcss"; 