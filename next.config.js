const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public'
})

module.exports = withPWA({
  // next.js config
  experimental: {
    scrollRestoration: true
  },
})
