import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as readline from 'readline'

// Load environment variables
dotenv.config()

// Initialize the client
const client = createClient({
  projectId: 'ivfy9y3f',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-19',
  token: process.env.SANITY_TOKEN
})

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Function to ask a yes/no question
const askQuestion = (question: string): Promise<boolean> => {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n) `, (answer) => {
      resolve(answer.toLowerCase() === 'y')
    })
  })
}

async function runAllMigrations() {
  try {
    console.log('=== MENU SCHEMA MIGRATION UTILITY ===')
    console.log('This script will migrate content from the old schema structure to the new category-specific schemas.')
    
    const proceed = await askQuestion('Do you want to proceed with the migration?')
    if (!proceed) {
      console.log('Migration aborted.')
      rl.close()
      return
    }
    
    // 1. Migrate simple menu items
    console.log('\n--- STEP 1: Migrating Simple Menu Items ---')
    const migrateSimple = await askQuestion('Do you want to migrate simple menu items to category-specific schemas?')
    if (migrateSimple) {
      await import('./migrateSimpleMenuItems')
      console.log('Simple menu items migration completed.')
    } else {
      console.log('Skipping simple menu items migration.')
    }
    
    // 2. Migrate spirits from size variant items
    console.log('\n--- STEP 2: Migrating Spirit Items ---')
    const migrateSpirits = await askQuestion('Do you want to migrate spirit items from size variant items?')
    if (migrateSpirits) {
      await import('./migrateSizeVariantItems')
      console.log('Spirit items migration completed.')
    } else {
      console.log('Skipping spirit items migration.')
    }
    
    // 3. Migrate cocktails and tags
    console.log('\n--- STEP 3: Migrating Cocktails and Tags ---')
    const migrateCocktails = await askQuestion('Do you want to migrate cocktails and tags to the new schemas?')
    if (migrateCocktails) {
      await import('./migrateCocktails')
      console.log('Cocktails and tags migration completed.')
    } else {
      console.log('Skipping cocktails migration.')
    }
    
    // Ask if user wants to delete old content
    console.log('\n--- CLEANUP: Removing Old Content ---')
    const deleteOld = await askQuestion('Do you want to delete the old content now? (Make sure the migration was successful first)')
    
    if (deleteOld) {
      // Create a transaction for deletion
      const deleteTransaction = client.transaction()
      
      // Collect old items to delete
      console.log('Fetching old content to delete...')
      
      if (migrateSimple) {
        const simpleMenuItems = await client.fetch('*[_type == "simpleMenuItem"]._id')
        simpleMenuItems.forEach((id: string) => deleteTransaction.delete(id))
        console.log(`Found ${simpleMenuItems.length} simple menu items to delete`)
      }
      
      if (migrateSpirits) {
        const spiritItems = await client.fetch('*[_type == "sizeVariantItem" && category == "spirits"]._id')
        spiritItems.forEach((id: string) => deleteTransaction.delete(id))
        console.log(`Found ${spiritItems.length} spirit items to delete`)
      }
      
      if (migrateCocktails) {
        const cocktails = await client.fetch('*[_type == "signatureCocktail"]._id')
        cocktails.forEach((id: string) => deleteTransaction.delete(id))
        
        const tags = await client.fetch('*[_type == "signatureCocktailTag"]._id')
        tags.forEach((id: string) => deleteTransaction.delete(id))
        
        console.log(`Found ${cocktails.length} cocktails and ${tags.length} tags to delete`)
      }
      
      // Commit the deletion
      console.log('Deleting old content...')
      await deleteTransaction.commit()
      console.log('Old content deleted successfully.')
    } else {
      console.log('Keeping old content for now. You can delete it manually later.')
    }
    
    console.log('\n=== MIGRATION COMPLETED ===')
    console.log('Your content has been migrated to the new category-specific schema structure.')
    
    rl.close()
  } catch (error) {
    console.error('Error during migration:', error)
    rl.close()
  }
}

// Run the migrations
runAllMigrations() 