export default ({ env }) => {
  return {
    "schemas-to-ts": {
      enabled: true,
    },
    email: {
      config: {
        provider: "amazon-ses",
        providerOptions: {
          key: env("AWS_SES_KEY"),
          secret: env("AWS_SES_SECRET"),
          amazon: "https://email.us-east-1.amazonaws.com",
        },
        settings: {
          defaultFrom: "a1112chaohao@gmail.com",
          defaultReplyTo: "a1112chaohao@gmail.com",
        },
      },
    },
    "strapi-plugin-populate-deep": {
      config: {
        defaultDepth: 3, // Default is 5
      },
    },
  };
};
