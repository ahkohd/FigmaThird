const imageTextureBase64 = `data:image/png;base64,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`;
export default imageTextureBase64;
