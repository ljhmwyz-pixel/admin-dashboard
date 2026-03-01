#!/usr/bin/env node

// @ts-check
/* global process, __dirname, require */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
/* eslint-enable @typescript-eslint/no-require-imports */

console.log('🚀 开始构建后处理...');

// 读取 package.json 版本号
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

// 生成构建信息
const buildInfo = {
  version: version,
  buildTime: new Date().toISOString(),
  buildEnv: process.env.NODE_ENV || 'production',
  gitHash: process.env.GIT_HASH || 'unknown',
  branch: process.env.GIT_BRANCH || 'unknown',
};

// 写入构建信息文件
const buildInfoPath = path.join(__dirname, '../dist/build-info.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ 构建信息已生成:', buildInfoPath);

// 生成 service worker 缓存清单
const generateCacheManifest = () => {
  const distPath = path.join(__dirname, '../dist');
  const files = [];

  const walk = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const relativePath = path.relative(distPath, fullPath);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (stat.isFile()) {
        files.push({
          url: '/' + relativePath.replace(/\\/g, '/'),
          revision: stat.mtime.getTime().toString(),
        });
      }
    });
  };

  walk(distPath);

  const manifest = {
    version: version,
    timestamp: Date.now(),
    files: files,
  };

  const manifestPath = path.join(distPath, 'cache-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('✅ 缓存清单已生成:', manifestPath);
};

generateCacheManifest();

// 压缩静态资源
const compressAssets = () => {
  const distPath = path.join(__dirname, '../dist');
  /* eslint-disable @typescript-eslint/no-require-imports */
  const gzip = require('zlib').gzipSync;
  /* eslint-enable @typescript-eslint/no-require-imports */

  const compressFile = (filePath) => {
    const content = fs.readFileSync(filePath);
    const compressed = gzip(content);
    const gzPath = filePath + '.gz';
    fs.writeFileSync(gzPath, compressed);
  };

  const walk = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (
        stat.isFile() &&
        (item.endsWith('.js') || item.endsWith('.css') || item.endsWith('.html'))
      ) {
        compressFile(fullPath);
      }
    });
  };

  try {
    walk(distPath);
    console.log('✅ 静态资源压缩完成');
  } catch (error) {
    console.log('⚠️  静态资源压缩跳过:', error.message);
  }
};

compressAssets();

// 生成 robots.txt
const generateRobotsTxt = () => {
  const robotsTxt = `User-agent: *
Disallow: /api/
Disallow: /admin/
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml

Host: yourdomain.com
`;

  const robotsPath = path.join(__dirname, '../dist/robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);

  console.log('✅ robots.txt 已生成');
};

generateRobotsTxt();

// 生成安全头文件
const generateSecurityHeaders = () => {
  const securityHeaders = {
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const headersPath = path.join(__dirname, '../dist/_headers');
  let headersContent = '';

  Object.entries(securityHeaders).forEach(([header, value]) => {
    headersContent += `/*\n  ${header}: ${value}\n\n`;
  });

  fs.writeFileSync(headersPath, headersContent);

  console.log('✅ 安全头文件已生成');
};

generateSecurityHeaders();

console.log('🎉 构建后处理完成！');
