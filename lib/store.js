import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const filePath = path.join(dataDirectory, 'clans.json');

function readData() {
  if (!fs.existsSync(filePath)) {
    return { tags: [], settings: { clansPerRow: 3 } };
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  // Migration: If data is array, convert to object
  if (Array.isArray(data)) {
    const newData = { tags: data, settings: { clansPerRow: 3 } };
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    return newData;
  }
  
  return data;
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getStoreData() {
  return readData();
}

export function getClanTags() {
  return readData().tags;
}

export function addClanTag(tag) {
  const data = readData();
  if (!data.tags.includes(tag)) {
    data.tags.push(tag);
    writeData(data);
    return true;
  }
  return false;
}

export function removeClanTag(tag) {
  const data = readData();
  const initialLength = data.tags.length;
  data.tags = data.tags.filter(t => t !== tag);
  if (data.tags.length !== initialLength) {
    writeData(data);
    return true;
  }
  return false;
}

export function reorderClanTags(newTags) {
  const data = readData();
  data.tags = newTags;
  writeData(data);
  return true;
}

export function updateSettings(newSettings) {
  const data = readData();
  data.settings = { ...data.settings, ...newSettings };
  writeData(data);
  return true;
}
