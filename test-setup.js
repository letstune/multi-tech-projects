#!/usr/bin/env node

/**
 * ISHTDEV KUMBH MELA SYSTEM - SETUP VERIFICATION SCRIPT
 * 
 * This script tests the current system setup and verifies:
 * - Environment variables
 * - Database connection
 * - API endpoints
 * - External service configurations
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

console.log('🚀 ISHTDEV KUMBH MELA SYSTEM - SETUP VERIFICATION\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test environment variables
function testEnvironmentVariables() {
  log('\n📋 TESTING ENVIRONMENT VARIABLES', 'bold');
  
  const requiredVars = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'CORS_ORIGIN'
  ];
  
  const optionalVars = [
    'GOOGLE_MAPS_API_KEY',
    'WEATHER_API_KEY',
    'SMTP_EMAIL',
    'SMTP_PASSWORD',
    'SMS_API_KEY',
    'FCM_SERVER_KEY',
    'OPENROUTESERVICE_API_KEY'
  ];
  
  let requiredCount = 0;
  let optionalCount = 0;
  
  // Check required variables
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      success(`${varName}: Configured`);
      requiredCount++;
    } else {
      error(`${varName}: Missing (REQUIRED)`);
    }
  });
  
  // Check optional variables
  optionalVars.forEach(varName => {
    if (process.env[varName] && process.env[varName] !== 'your_' + varName.toLowerCase() + '_here') {
      success(`${varName}: Configured`);
      optionalCount++;
    } else {
      warning(`${varName}: Not configured (optional)`);
    }
  });
  
  info(`Required variables: ${requiredCount}/${requiredVars.length}`);
  info(`Optional variables: ${optionalCount}/${optionalVars.length}`);
  
  return requiredCount === requiredVars.length;
}

// Test database connection
async function testDatabaseConnection() {
  log('\n🗄️  TESTING DATABASE CONNECTION', 'bold');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    success('MongoDB connection: Successful');
    success(`Database: ${mongoose.connection.db.databaseName}`);
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    info(`Collections found: ${collections.length}`);
    
    await mongoose.connection.close();
    return true;
  } catch (err) {
    error(`MongoDB connection failed: ${err.message}`);
    return false;
  }
}

// Test backend server
async function testBackendServer() {
  log('\n🖥️  TESTING BACKEND SERVER', 'bold');
  
  try {
    // Test if server is running
    const response = await axios.get('http://localhost:5000/api/test', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      success('Backend server: Running');
      success(`Response: ${response.data.message}`);
      return true;
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      warning('Backend server: Not running (start with: cd backend && npm run dev)');
    } else {
      error(`Backend server error: ${err.message}`);
    }
    return false;
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  log('\n🔗 TESTING API ENDPOINTS', 'bold');
  
  const endpoints = [
    '/api/locations',
    '/api/crowd',
    '/api/alerts',
    '/api/lost-found',
    '/api/timing',
    '/api/mobile',
    '/api/settings'
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        timeout: 3000
      });
      
      if (response.status === 200) {
        success(`${endpoint}: Working`);
        successCount++;
      }
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        warning(`${endpoint}: Server not running`);
      } else {
        error(`${endpoint}: ${err.response?.status || 'Error'}`);
      }
    }
  }
  
  info(`Working endpoints: ${successCount}/${endpoints.length}`);
  return successCount > 0;
}

// Test external services
async function testExternalServices() {
  log('\n🌐 TESTING EXTERNAL SERVICES', 'bold');
  
  // Test OpenRouteService
  if (process.env.OPENROUTESERVICE_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/foot-walking',
        {
          coordinates: [[81.8463, 25.4358], [81.8500, 25.4400]]
        },
        {
          headers: {
            'Authorization': process.env.OPENROUTESERVICE_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      if (response.status === 200) {
        success('OpenRouteService API: Working');
      }
    } catch (err) {
      error(`OpenRouteService API: ${err.response?.status || err.message}`);
    }
  } else {
    warning('OpenRouteService API: Not configured');
  }
  
  // Test Weather API (if configured)
  if (process.env.WEATHER_API_KEY && process.env.WEATHER_API_KEY !== 'your_openweather_api_key_here') {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Prayagraj&appid=${process.env.WEATHER_API_KEY}`,
        { timeout: 5000 }
      );
      
      if (response.status === 200) {
        success('Weather API: Working');
      }
    } catch (err) {
      error(`Weather API: ${err.response?.status || err.message}`);
    }
  } else {
    warning('Weather API: Not configured');
  }
}

// Test frontend
async function testFrontend() {
  log('\n🎨 TESTING FRONTEND', 'bold');
  
  try {
    const response = await axios.get('http://localhost:3000', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      success('Frontend server: Running');
      return true;
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      warning('Frontend server: Not running (start with: cd ishtdev-dashboard && npm run dev)');
    } else {
      error(`Frontend server error: ${err.message}`);
    }
    return false;
  }
}

// Main test function
async function runTests() {
  try {
    const envTest = testEnvironmentVariables();
    const dbTest = await testDatabaseConnection();
    const backendTest = await testBackendServer();
    const apiTest = await testAPIEndpoints();
    await testExternalServices();
    const frontendTest = await testFrontend();
    
    log('\n📊 SUMMARY', 'bold');
    
    if (envTest && dbTest) {
      success('Core system: Ready');
    } else {
      error('Core system: Issues found');
    }
    
    if (backendTest && apiTest) {
      success('Backend APIs: Working');
    } else {
      warning('Backend APIs: Start server with "cd backend && npm run dev"');
    }
    
    if (frontendTest) {
      success('Frontend: Working');
    } else {
      warning('Frontend: Start server with "cd ishtdev-dashboard && npm run dev"');
    }
    
    log('\n🚀 NEXT STEPS:', 'bold');
    info('1. Configure missing API keys in environment files');
    info('2. Start backend server: cd backend && npm run dev');
    info('3. Start frontend server: cd ishtdev-dashboard && npm run dev');
    info('4. Visit http://localhost:3000 to access the dashboard');
    info('5. Check API_SERVICES_SETUP.md for detailed configuration');
    
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }
}

// Run the tests
runTests();
