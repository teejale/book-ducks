'use strict';

const { put, del } = require('@vercel/blob');

module.exports = {
  init({ token }) {
    async function upload(file) {
      if (!token && !process.env.BLOB_STORE_ID) throw new Error('Connect a public Vercel Blob store before uploading images.');
      const blob = await put(`uploads/${file.hash}${file.ext || ''}`, file.stream || file.buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.mime,
        token,
      });
      file.url = blob.url;
      file.provider_metadata = { pathname: blob.pathname };
    }

    return {
      upload,
      uploadStream: upload,
      async delete(file) {
        if (!token && !process.env.BLOB_STORE_ID) throw new Error('Vercel Blob storage is not configured.');
        await del(file.url, { token });
      },
    };
  },
};
