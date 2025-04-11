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

async function cleanupOldData() {
  try {
    console.log('=== OLD DATA CLEANUP UTILITY ===')
    
    // Get counts for old schemas
    const oldSchemas = [
      'simpleMenuItem',
      'sizeVariantItem',
      'signatureCocktail',
      'signatureCocktailTag'
    ]
    
    console.log('\nCurrent state of old schemas:')
    for (const schema of oldSchemas) {
      const count = await client.fetch(`count(*[_type == "${schema}"])`)
      console.log(`- ${schema}: ${count} items`)
    }
    
    const confirmCleanup = await askQuestion('\nDo you want to permanently delete all data from these schemas?')
    
    if (!confirmCleanup) {
      console.log('Cleanup aborted.')
      rl.close()
      return
    }
    
    console.log('\nDeleting old schema data...')
    
    // Create a transaction for deletion
    const deleteTransaction = client.transaction()
    
    // Delete all simpleMenuItems
    const simpleMenuItems = await client.fetch('*[_type == "simpleMenuItem"]._id')
    simpleMenuItems.forEach((id: string) => deleteTransaction.delete(id))
    console.log(`- Found ${simpleMenuItems.length} simpleMenuItem items to delete`)
    
    // Delete all sizeVariantItems
    const sizeVariantItems = await client.fetch('*[_type == "sizeVariantItem"]._id')
    sizeVariantItems.forEach((id: string) => deleteTransaction.delete(id))
    console.log(`- Found ${sizeVariantItems.length} sizeVariantItem items to delete`)
    
    // Delete all signatureCocktails
    const signatureCocktails = await client.fetch('*[_type == "signatureCocktail"]._id')
    signatureCocktails.forEach((id: string) => deleteTransaction.delete(id))
    console.log(`- Found ${signatureCocktails.length} signatureCocktail items to delete`)
    
    // Delete all signatureCocktailTags
    const signatureCocktailTags = await client.fetch('*[_type == "signatureCocktailTag"]._id')
    signatureCocktailTags.forEach((id: string) => deleteTransaction.delete(id))
    console.log(`- Found ${signatureCocktailTags.length} signatureCocktailTag items to delete`)
    
    // Commit the deletion
    console.log('\nCommitting deletion...')
    const result = await deleteTransaction.commit()
    console.log('Deletion completed successfully!', result)
    
    console.log('\n=== CLEANUP COMPLETED ===')
    
    rl.close()
  } catch (error) {
    console.error('Error during cleanup:', error)
    rl.close()
  }
}

// Run the cleanup
cleanupOldData() 