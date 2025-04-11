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

type SimpleMenuItem = {
  _id: string
  title: {
    en: string
    gr: string
  }
  description?: {
    en?: string
    gr?: string
  }
  price: number
  category: string
  orderRank?: number
}

const categoryToSchemaMap: Record<string, string> = {
  'coffee': 'coffeeItem',
  'tea': 'teaItem',
  'soft-drinks': 'softDrinkItem',
  'juices': 'juiceItem',
  'sparkling-waters': 'sparklingWaterItem'
}

async function migrateSimpleMenuItems() {
  try {
    console.log('Starting migration...')
    
    // Fetch all simpleMenuItems
    const query = '*[_type == "simpleMenuItem"]'
    const simpleMenuItems: SimpleMenuItem[] = await client.fetch(query)
    
    console.log(`Found ${simpleMenuItems.length} simple menu items to migrate`)
    
    // Prepare a transaction
    const transaction = client.transaction()
    
    // Process each item
    for (const item of simpleMenuItems) {
      const newType = categoryToSchemaMap[item.category]
      
      if (!newType) {
        console.warn(`Skipping item with unknown category: ${item.category}`)
        continue
      }
      
      // Create the new item with the appropriate schema type
      const newItem = {
        _type: newType,
        title: item.title,
        description: item.description || { en: '', gr: '' },
        price: item.price,
        orderRank: item.orderRank || 0,
      }
      
      console.log(`Migrating ${item.title.en} from simpleMenuItem to ${newType}`)
      
      // Add to transaction
      transaction.create(newItem)
    }
    
    // Commit transaction
    console.log('Committing changes...')
    const result = await transaction.commit()
    console.log('Migration completed successfully!', result)
    
    // Note: You may want to delete the old simpleMenuItems after confirming the migration worked
    // That would require another transaction and confirmation from the user
    
  } catch (error) {
    console.error('Error during migration:', error)
  }
}

// Execute the migration
migrateSimpleMenuItems() 