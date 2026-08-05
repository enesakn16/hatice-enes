#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'index.html',
  'style.css',
  'script.js',
  'no1-party-anthem.mp3',
  'image-1.txt',
  'image-2.txt',
  'image-3.txt',
  'image-4.txt'
];

function fail(message) {
  throw new Error(message);
}

function validateBase64Chunks() {
  const chunks = ['image-1.txt', 'image-2.txt', 'image-3.txt', 'image-4.txt']
    .map((file) => fs.readFileSync(path.join(root, file), 'utf8').trim());
  const joined = chunks.join('');

  if (!joined || !/^[A-Za-z0-9+/=]+$/.test(joined)) {
    fail('Fotoğraf parçaları geçerli base64 içermiyor.');
  }

  const image = Buffer.from(joined, 'base64');
  if (image.length < 4 || image[0] !== 0xff || image[1] !== 0xd8) {
    fail('Birleştirilen fotoğraf JPEG başlığı taşımıyor.');
  }
}

function validateHtmlReferences() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const references = [...html.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)]
    .map((match) => match[1])
    .filter((value) => !/^(?:https?:|data:|mailto:|tel:)/i.test(value));

  for (const reference of references) {
    if (!fs.existsSync(path.join(root, reference))) {
      fail(`index.html eksik bir dosyaya referans veriyor: ${reference}`);
    }
  }
}

function validateMp3() {
  const mp3 = fs.readFileSync(path.join(root, 'no1-party-anthem.mp3'));
  const hasId3 = mp3.length >= 3 && mp3.subarray(0, 3).toString('ascii') === 'ID3';
  const hasFrameSync = mp3.length >= 2 && mp3[0] === 0xff && (mp3[1] & 0xe0) === 0xe0;
  if (!hasId3 && !hasFrameSync) fail('Müzik dosyası geçerli MP3 başlığı taşımıyor.');
}

function validate() {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length) fail(`Zorunlu dosyalar eksik: ${missing.join(', ')}`);

  validateHtmlReferences();
  validateBase64Chunks();
  validateMp3();
  return { requiredFiles: requiredFiles.length };
}

if (require.main === module) {
  try {
    const result = validate();
    console.log(`Statik site doğrulandı: ${result.requiredFiles} zorunlu dosya sağlam.`);
  } catch (error) {
    console.error(`Doğrulama başarısız: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { validate };
