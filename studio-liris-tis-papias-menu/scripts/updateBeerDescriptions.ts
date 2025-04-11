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

async function updateBeerDescriptions() {
  try {
    console.log('Fetching beer items...')
    
    // Get all beers with title matching "Stella Artois" and "Mamos Pils"
    const beersToUpdate = await client.fetch(`*[_type == "beerItem" && (title.en match "Stella Artois" || title.en match "Mamos Pils")]`)
    
    console.log(`Found ${beersToUpdate.length} beer items to update`)
    
    const transaction = client.transaction()
    
    // Update each beer (remove the description)
    for (const beer of beersToUpdate) {
      console.log(`Updating description for: ${beer.title.en}`)
      
      transaction.patch(beer._id, {
        // Unset (remove) the description field
        unset: ['description']
      })
    }
    
    // Commit changes
    console.log('Committing changes...')
    const result = await transaction.commit()
    console.log('Successfully updated beer descriptions:', result)
    
  } catch (error) {
    console.error('Error updating beer descriptions:', error)
  }
}

// Run the update
updateBeerDescriptions() 