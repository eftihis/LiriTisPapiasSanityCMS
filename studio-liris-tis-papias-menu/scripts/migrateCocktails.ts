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

type SignatureCocktail = {
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

type CocktailTag = {
  _id: string
  name: string
}

async function migrateCocktails() {
  try {
    console.log('Starting migration of cocktails...')
    
    // Migrate tags first
    console.log('Migrating cocktail tags...')
    
    // Fetch all current cocktail tags
    const tagsQuery = '*[_type == "signatureCocktailTag"]'
    const oldTags: CocktailTag[] = await client.fetch(tagsQuery)
    
    console.log(`Found ${oldTags.length} cocktail tags to migrate`)
    
    // Create a mapping from old tag IDs to new tag IDs
    const tagIdMap: Record<string, string> = {}
    
    // Prepare a transaction for tags
    const tagTransaction = client.transaction()
    
    // Process each tag
    for (const tag of oldTags) {
      // Create new tag with the new schema
      const newTag = {
        _type: 'cocktailTag',
        name: tag.name
      }
      
      // Add to transaction and track the ID
      const newTagId = `newtag_${tag._id}`
      tagTransaction.create({...newTag, _id: newTagId})
      tagIdMap[tag._id] = newTagId
    }
    
    // Commit tag transaction
    console.log('Committing tag changes...')
    await tagTransaction.commit()
    console.log('Tag migration completed successfully!')
    
    // Fetch all signature cocktails
    const cocktailsQuery = '*[_type == "signatureCocktail"]'
    const cocktails: SignatureCocktail[] = await client.fetch(cocktailsQuery)
    
    console.log(`Found ${cocktails.length} cocktails to migrate`)
    
    // Prepare a transaction for cocktails
    const cocktailTransaction = client.transaction()
    
    // Process each cocktail
    for (const cocktail of cocktails) {
      // Create the new cocktail with the new schema
      const newCocktail = {
        _type: 'cocktailItem',
        title: cocktail.title,
        description: cocktail.description || { en: '', gr: '' },
        price: cocktail.price,
        category: cocktail.category,
        // Map the old tag references to new tag references
        cocktailTags: cocktail.cocktailTags.map((tagRef: any) => {
          const oldId = tagRef._ref
          const newId = tagIdMap[oldId]
          return {
            _type: 'reference',
            _ref: newId
          }
        }),
        orderRank: cocktail.orderRank || 0
      }
      
      console.log(`Migrating ${cocktail.title.en} from signatureCocktail to cocktailItem`)
      
      // Add to transaction
      cocktailTransaction.create(newCocktail)
    }
    
    // Commit cocktail transaction
    console.log('Committing cocktail changes...')
    const result = await cocktailTransaction.commit()
    console.log('Cocktail migration completed successfully!', result)
    
    // Note: You may want to delete the old items after confirming the migration worked
    
  } catch (error) {
    console.error('Error during migration:', error)
  }
}

// Execute the migration
migrateCocktails() 