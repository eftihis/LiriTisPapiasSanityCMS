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

async function removeAllSpiritItems() {
  try {
    console.log('Fetching all spirit items...')
    const query = '*[_type == "spiritItem" || (_type == "size" && category == "spirits")]._id'
    const ids = await client.fetch(query)
    
    console.log(`Found ${ids.length} spirit items to delete`)
    
    if (ids.length === 0) {
      console.log('No spirit items to delete')
      return
    }
    
    if (ids.length > 0) {
      console.log('Deleting all spirit items...')
      const transaction = client.transaction()
      
      ids.forEach((id: string) => {
        transaction.delete(id)
      })
      
      const result = await transaction.commit()
      console.log('Successfully deleted all spirit items:', result)
    }
  } catch (error) {
    console.error('Error removing spirit items:', error)
  }
}

removeAllSpiritItems() 