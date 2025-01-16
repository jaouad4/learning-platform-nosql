const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🏃 Starting API tests...\n');

    try {
        // 1. Test de création d'un cours
        console.log('1️⃣ Testing course creation...');
        const courseData = {
            title: 'Test Course',
            description: 'Test Description',
            price: 99.99,
            duration: '2h'
        };

        const createResponse = await axios.post(`${API_URL}/courses`, courseData);
        const courseId = createResponse.data._id;
        console.log('✅ Course created successfully:', courseId);

        // 2. Test de récupération du cours
        console.log('\n2️⃣ Testing course retrieval...');
        const getResponse = await axios.get(`${API_URL}/courses/${courseId}`);
        console.log('✅ Course retrieved successfully');
        console.log('📝 Course data:', getResponse.data);

        // 3. Test du cache Redis
        console.log('\n3️⃣ Testing Redis cache...');
        console.log('Making second request to check cache...');
        const start = Date.now();
        await axios.get(`${API_URL}/courses/${courseId}`);
        const duration = Date.now() - start;
        console.log(`✅ Second request completed in ${duration}ms (should be faster)`);

        // 4. Test des statistiques
        console.log('\n4️⃣ Testing course statistics...');
        const statsResponse = await axios.get(`${API_URL}/courses/stats`);
        console.log('✅ Statistics retrieved successfully');
        console.log('📊 Stats:', statsResponse.data);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
    }
}

// Installer axios avant d'exécuter : npm install axios
testAPI();