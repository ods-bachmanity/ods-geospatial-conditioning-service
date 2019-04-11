module.exports = {
  apps : [{
    name: "gcs",
    script: "./index.js",
    instances: -1,
    log: "/var/log/gcs/app/app.log",
    merge_logs: true,
    log_type: "json",
    env: {
      NODE_ENV: "production"
    }
  }]
}