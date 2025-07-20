const axios = require('axios');

// 测试数据
const testData = {
  environment: 'production',
  project: {
    name: 'test-project'
  },
  level: 'error',
  datetime: new Date().toISOString(),
  url: 'https://sentry.io/organizations/test-org/issues/123',
  message: 'Test error message from Sentry',
  culprit: 'test.js:1:1',
  user: {
    id: '12345',
    email: 'test@example.com',
    username: 'testuser'
  },
  tags: {
    release: 'v1.0.0',
    browser: 'Chrome',
    os: 'macOS',
    device: 'desktop'
  }
};

// 测试本地开发服务器
async function testLocalWebhook() {
  try {
    console.log('🧪 测试本地 webhook...');
    
    const response = await axios.post('http://localhost:8888/.netlify/functions/sentry-webhook', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ 本地测试成功!');
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
    
  } catch (error) {
    console.error('❌ 本地测试失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else {
      console.error('错误信息:', error.message);
    }
  }
}

// 测试生产环境（需要替换为实际的URL）
async function testProductionWebhook(url) {
  if (!url) {
    console.log('⚠️  跳过生产环境测试（未提供URL）');
    return;
  }
  
  try {
    console.log('🧪 测试生产环境 webhook...');
    
    const response = await axios.post(url, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ 生产环境测试成功!');
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
    
  } catch (error) {
    console.error('❌ 生产环境测试失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else {
      console.error('错误信息:', error.message);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 开始测试 Sentry to DingDing Webhook\n');
  
  // 测试本地环境
  await testLocalWebhook();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 测试生产环境（如果有提供URL）
  const productionUrl = process.argv[2];
  await testProductionWebhook(productionUrl);
  
  console.log('\n✨ 测试完成!');
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testLocalWebhook,
  testProductionWebhook,
  testData
}; 