import { auditPages } from '@wfynbzlx666/sdk-perf-spa'

const summary = await auditPages({
  urls: [
    'https://xixiemperor.github.io/BMT-MicroApps/#/home',
    'https://xixiemperor.github.io/BMT-MicroApps/#/booking',
    'https://xixiemperor.github.io/BMT-MicroApps/#/shop',
    'https://xixiemperor.github.io/BMT-MicroApps/#/login',
    // 'https://xixiemperor.github.io/BMT-MicroApps/#/orders',
    'https://xixiemperor.github.io/BMT-MicroApps/#/forum',
    // 'https://xixiemperor.github.io/BMT-MicroApps/#/user-center',
    // 'https://xixiemperor.github.io/BMT-MicroApps/#/booking-history',
    'https://xixiemperor.github.io/BMT-MicroApps/#/publish-post',
    // 'https://xixiemperor.github.io/BMT-MicroApps/#/post/2',
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
    path: './audit-reports/batch-report.html',
    verbose: false
  },
  onProgress: (progress) => {
    console.log(`[${progress.current}/${progress.total}] ${progress.url}: ${progress.status}`)
  }
})

console.log('审计完成:', summary.success, '/', summary.total)
console.log('平均性能分数:', summary.averagePerformanceScore)
