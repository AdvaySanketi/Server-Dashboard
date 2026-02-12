module.exports = {
  apps : [{
    name: 'Archive Dashboard',
    script: './app/server/index.js',
    watch: false,
    env: {
      "ARCHIVE_DASH_SERVER_PORT": 2800
    },
  }],
};
