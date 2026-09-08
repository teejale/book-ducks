const path = require('node:path');

module.exports = ({ env }) => {
  if (!env('VERCEL') && !env('BLOB_READ_WRITE_TOKEN')) return {};

  return {
    upload: {
      config: {
        provider: path.resolve(__dirname, '../src/providers/vercel-blob'),
        providerOptions: { token: env('BLOB_READ_WRITE_TOKEN') },
        // Leave room for multipart headers below Vercel's request size limit.
        sizeLimit: 4 * 1024 * 1024,
      },
    },
  };
};
