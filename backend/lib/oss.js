const OSS = require('ali-oss');

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIwwnpvDWiyuf1',
  accessKeySecret: 'jYKLH9PXdeyMiVhcIkVHqeU8IHMdcx',
  bucket: 'dhu-treehole',
});

module.exports = client;
