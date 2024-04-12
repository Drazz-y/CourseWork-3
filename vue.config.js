const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    workboxPluginMode: "GenerateSW",
    skipWaiting: true,
    workboxOptions: {
      runtimeCaching: [{
        // Routing via a matchCallback function:
        urlPattern: ({request, url}) =>  request.destination === "image",
        handler: 'StaleWhileRevalidate'
      },
        {
          urlPattern: ({ url }) => url.pathname === '/lessons' ,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'response-cache'
          }
        }
      ],
    }}
})
