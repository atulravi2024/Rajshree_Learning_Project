const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUDIO_DIR = path.resolve('frontend/public/assets/audio');

function getDuration(filePath) {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: 'utf8' }
    );
    return parseFloat(output.trim());
  } catch (error) {
    console.error(`Error getting duration for ${filePath}:`, error.message);
    return 0;
  }
}

function analyze() {
  const stats = {};

  if (!fs.existsSync(AUDIO_DIR)) {
    console.error(`Audio directory not found: ${AUDIO_DIR}`);
    return;
  }

  const categories = fs.readdirSync(AUDIO_DIR).filter(f => fs.statSync(path.join(AUDIO_DIR, f)).isDirectory());

  categories.forEach(category => {
    stats[category] = [];
    const categoryPath = path.join(AUDIO_DIR, category);

    function walkSync(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          walkSync(filePath);
        } else if (file.endsWith('.mp3')) {
          const duration = getDuration(filePath);
          if (duration > 0) {
            stats[category].push({ path: filePath, duration });
          }
        }
      });
    }

    walkSync(categoryPath);
  });

  console.log('# Detailed Audio Analysis Report\n');
  console.log('I have analyzed all audio files in `frontend/public/assets/audio`, focusing on individual files with a duration under 10 seconds, categorized by their folder names.\n');
  
  console.log('## Executive Summary\n');
  console.log('| Category | Total Files | Min (s) | Max (s) | Avg (s) | Files < 10s | Avg < 10s (s) |');
  console.log('| :--- | :---: | :---: | :---: | :---: | :---: | :---: |');

  const summaryData = [];

  Object.entries(stats).forEach(([category, durations]) => {
    if (durations.length === 0) {
      summaryData.push(`| **${category}** | 0 | - | - | - | 0 | - |`);
      return;
    }

    const min = Math.min(...durations.map(d => d.duration));
    const max = Math.max(...durations.map(d => d.duration));
    const avg = durations.reduce((a, b) => a + b.duration, 0) / durations.length;
    const below10 = durations.filter(d => d.duration < 10);
    const avgBelow10 = below10.length > 0 
      ? (below10.reduce((a, b) => a + b.duration, 0) / below10.length) 
      : 0;

    summaryData.push(`| **${category}** | ${durations.length} | ${min.toFixed(2)} | ${max.toFixed(2)} | ${avg.toFixed(2)} | ${below10.length} | ${avgBelow10.toFixed(2)} |`);
  });

  summaryData.sort().forEach(line => console.log(line));
  console.log('\n---\n');
  console.log('## Individual Files Under 10 Seconds\n');
  console.log('Below is the list of individual files under 10 seconds for each category.\n');

  Object.entries(stats).sort().forEach(([category, durations]) => {
    const below10 = durations.filter(d => d.duration < 10).sort((a, b) => a.duration - b.duration);
    
    if (below10.length > 0) {
      console.log(`### ${category.charAt(0).toUpperCase() + category.slice(1)} (${below10.length} files < 10s)`);
      console.log('| File | Absolute Path | Duration (s) |');
      console.log('| --- | --- | --- |');
      below10.forEach(d => {
        const fileName = path.basename(d.path);
        console.log(`| \`${fileName}\` | \`${d.path}\` | ${d.duration.toFixed(2)} |`);
      });
      console.log('');
    }
  });
}

analyze();
