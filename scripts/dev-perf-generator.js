import { auditPages } from '@wfynbzlx666/sdk-perf-spa'

const summary = await auditPages({
  urls: [
    'http://localhost:4173/#/home',
    'http://localhost:4173/#/booking',
    'http://localhost:4173/#/shop',
    'http://localhost:4173/#/login',
    'http://localhost:4173/#/forum',
    'http://localhost:4173/#/publish-post',
  ],
  lighthouse: {
    formFactor: 'desktop',
    categories: ['performance,accessibility,best-practices,seo']
  },
  puppeteer: {
    headless: true,
    timeout: 60000
  },
  concurrency: 1,           // 同时审计 2 个页面
  retryCount: 1,            // 失败重试 1 次
  output: {
    format: 'html',
    path: './audit-reports/1-dev-batch-report.html',
    verbose: false
  },
  onProgress: (progress) => {
    console.log(`[${progress.current}/${progress.total}] ${progress.url}: ${progress.status}`)
  }
})

console.log('审计完成:', summary.success, '/', summary.total)
console.log('平均性能分数:', summary.averagePerformanceScore)
