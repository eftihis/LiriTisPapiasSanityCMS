import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'

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

async function checkSchemas() {
  try {
    console.log('=== SCHEMA STRUCTURE CHECK ===')
    
    // Get counts for old schemas
    const oldSchemas = [
      'simpleMenuItem',
      'sizeVariantItem',
      'signatureCocktail',
      'signatureCocktailTag',
      'cocktailItem'
    ]
    
    console.log('\nChecking for old schemas:')
    for (const schema of oldSchemas) {
      const count = await client.fetch(`count(*[_type == "${schema}"])`)
      console.log(`- ${schema}: ${count} items`)
    }
    
    // Get counts for new schemas
    const newSchemas = [
      'coffeeItem',
      'teaItem',
      'softDrinkItem',
      'juiceItem',
      'sparklingWaterItem',
      'spiritItem',
      'wineItem',
      'signatureCocktailItem',
      'regularCocktailItem',
      'cocktailTag',
      'beerItem'
    ]
    
    console.log('\nChecking for new schemas:')
    for (const schema of newSchemas) {
      const count = await client.fetch(`count(*[_type == "${schema}"])`)
      console.log(`- ${schema}: ${count} items`)
    }
    
    console.log('\n=== CHECK COMPLETED ===')
  } catch (error) {
    console.error('Error checking schemas:', error)
  }
}

// Run the check
checkSchemas() 