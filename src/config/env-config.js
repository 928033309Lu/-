const envConfig = {
  appNodeEnv: process.env.NODE_ENV,
  appTitle: process.env.VUE_APP_TITLE,
  developmentMode: process.env.NODE_ENV === 'development',
  apiBaseUrl: process.env.VUE_APP_API,
  apiElevationUrl: process.env.VUE_APP_API_ELELVATION
}

export default envConfig
