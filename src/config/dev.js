const config = {
  log: {
    level: 'trace',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
}

export default config