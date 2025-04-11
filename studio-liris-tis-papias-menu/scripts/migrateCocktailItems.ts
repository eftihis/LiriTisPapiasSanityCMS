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

type CocktailItem = {
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
  cocktailTags: any[]
  orderRank?: number
}

async function migrateCocktailItems() {
  try {
    console.log('Starting migration of cocktail items...')
    
    // Fetch all cocktailItems
    const query = '*[_type == "cocktailItem"]'
    const cocktailItems: CocktailItem[] = await client.fetch(query)
    
    console.log(`Found ${cocktailItems.length} cocktail items to migrate`)
    
    // Prepare a transaction
    const transaction = client.transaction()
    
    // Process each item
    for (const item of cocktailItems) {
      // Create the new signature cocktail item
      const newItem = {
        _type: 'signatureCocktailItem',
        title: item.title,
        description: item.description || { en: '', gr: '' },
        price: item.price,
        cocktailTags: item.cocktailTags,
        orderRank: item.orderRank || 0,
      }
      
      console.log(`Migrating ${item.title.en} from cocktailItem to signatureCocktailItem`)
      
      // Add to transaction
      transaction.create(newItem)
      
      // Delete the old item
      transaction.delete(item._id)
    }
    
    // Commit transaction
    console.log('Committing changes...')
    const result = await transaction.commit()
    console.log('Migration completed successfully!', result)
    
  } catch (error) {
    console.error('Error during migration:', error)
  }
}

// Execute the migration
migrateCocktailItems() 