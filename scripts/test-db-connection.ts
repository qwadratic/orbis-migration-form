import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

  try {
    console.log('Testing database connection...')
    
    // Try to connect and run a simple query
    const result = await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful!')
    console.log('Query result:', result)
    
    // Test if we can create a table
    console.log('\nTesting table creation...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Table creation successful!')
    
    // Test if we can insert data
    console.log('\nTesting data insertion...')
    await prisma.$executeRaw`
      INSERT INTO test_connection (id) VALUES (1)
    `
    console.log('✅ Data insertion successful!')
    
    // Test if we can read data
    console.log('\nTesting data reading...')
    const data = await prisma.$queryRaw`
      SELECT * FROM test_connection
    `
    console.log('✅ Data reading successful!')
    console.log('Read data:', data)
    
    // Clean up
    console.log('\nCleaning up...')
    await prisma.$executeRaw`
      DROP TABLE test_connection
    `
    console.log('✅ Cleanup successful!')
    
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error details:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testConnection() 