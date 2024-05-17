// Update with your config settings.

export default {

  development: {
    client: "mysql2",
    connection: {
      host : '127.0.0.1',
      database: "typing_square",
      user: "root",
      password: "Takuma_817",
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      host : '127.0.0.1',
      database: "typing_square",
      user: "root",
      password: "Takuma_817",
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: "mysql2",
    connection: {
      database: "typing_square",
      user: "root",
      password: "Takuma_817",
      socketPath: "/cloudsql/typing-square:asia-northeast1:typing-square-sql",
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};
