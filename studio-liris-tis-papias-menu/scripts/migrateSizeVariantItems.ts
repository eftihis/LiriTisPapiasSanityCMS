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

type SizeVariantItem = {
  _id: string
  title: {
    en: string
    gr: string
  }
  description?: {
    en?: string
    gr?: string
  }
  category: string
  subCategory: string
  variants: Array<{
    size: string
    price: number
  }>
  orderRank?: number
}

async function migrateSizeVariantItems() {
  try {
    console.log('Starting migration of size variant items...')
    
    // Fetch all sizeVariantItems
    const query = '*[_type == "sizeVariantItem" && category == "spirits"]'
    const sizeVariantItems: SizeVariantItem[] = await client.fetch(query)
    
    console.log(`Found ${sizeVariantItems.length} spirit items to migrate`)
    
    // Prepare a transaction
    const transaction = client.transaction()
    
    // Process each item
    for (const item of sizeVariantItems) {
      // Create the new spirit item
      const newItem = {
        _type: 'spiritItem',
        title: item.title,
        description: item.description || { en: '', gr: '' },
        subCategory: item.subCategory,
        variants: item.variants,
        orderRank: item.orderRank || 0,
      }
      
      console.log(`Migrating ${item.title.en} from sizeVariantItem to spiritItem`)
      
      // Add to transaction
      transaction.create(newItem)
    }
    
    // Commit transaction
    console.log('Committing changes...')
    const result = await transaction.commit()
    console.log('Migration completed successfully!', result)
    
    // Note: You may want to delete the old sizeVariantItems after confirming the migration worked
    // That would require another transaction and confirmation from the user
    
  } catch (error) {
    console.error('Error during migration:', error)
  }
}

// Execute the migration
migrateSizeVariantItems() 