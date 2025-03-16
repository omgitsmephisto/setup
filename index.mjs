#!/usr/bin/env zx

console.log(
  "⚠️  WARNING: I'm considering that you have Bun/NodeJS or similar JS runtime.\n"
);

async function check(value) {
  try {
    await $`which ${value}`;
    return { value: null };
  } catch (error) {
    if (!error.stdout) return { value };
    console.log(`🟥 Something wrong: `, error);
  }
}

async function install(name) {
  const curl = await check('curl');
  if (curl.value) await install(curl.value);
  
  try {
    switch (name) {
      case 'code':
        await $`curl -L -o vscode.deb https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64`;
        await $`sudo dpkg -i vscode.deb`
        break;
      case 'spotify':
        await $`curl -sS https://download.spotify.com/debian/pubkey_C85668DF69375001.gpg | sudo gpg --dearmor --yes -o /etc/apt/trusted.gpg.d/spotify.gpg`;
        await $`echo "deb https://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list`;
        await $`sudo apt-get update && sudo apt-get install spotify-client`;
      default:
        await $`sudo apt install ${name} -y`;
        break;
    }
  } catch (error) {
    console.log(`🟥 Something wrong: `, error);
  }
}

const zsh = await check('zsh');

const vim = await check('vim');
const git = await check('git');
const vscode = await check('code');
const spotify = await check('spotify');

if (zsh.value) await install(zsh.value);

if (vim.value) await install(vim.value);
if (git.value) await install(git.value);
if (vscode.value) await install(vscode.value);
if (spotify.value) await install(spotify.value);

console.log('✅ Successfully apps installed!\n')