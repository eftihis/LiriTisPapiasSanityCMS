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

type CocktailTag = {
  _id: string
  name: string | {
    en: string
    gr: string
  }
}

async function migrateCocktailTags() {
  try {
    console.log('Starting migration of cocktail tags to support Greek translations...')
    
    // Fetch all current cocktail tags
    const tagsQuery = '*[_type == "cocktailTag"]'
    const existingTags: CocktailTag[] = await client.fetch(tagsQuery)
    
    console.log(`Found ${existingTags.length} cocktail tags to migrate`)
    
    if (existingTags.length === 0) {
      console.log('No tags to migrate. Migration completed.')
      return
    }
    
    // Prepare a transaction for tags
    const tagTransaction = client.transaction()
    
    // Process each tag
    let migratedCount = 0
    let alreadyMigratedCount = 0
    
    for (const tag of existingTags) {
      // Skip tags that are already in the new format
      if (typeof tag.name === 'object' && tag.name.en && tag.name.gr) {
        console.log(`Tag ${tag._id} already in new format, skipping`)
        alreadyMigratedCount++
        continue
      }
      
      // Create new tag with the new schema
      const englishName = typeof tag.name === 'string' ? tag.name : ''
      
      // Default Greek name (same as English for now, to be updated manually)
      const updateTag = {
        name: {
          _type: 'object',
          en: englishName,
          gr: englishName // Set same as English initially
        }
      }
      
      console.log(`Migrating tag: ${englishName}`)
      migratedCount++
      
      // Update the existing tag
      tagTransaction.patch(tag._id, {
        set: updateTag
      })
    }
    
    if (migratedCount === 0) {
      console.log('All tags are already in the new format. No changes needed.')
      return
    }
    
    // Commit tag transaction
    console.log(`Committing changes for ${migratedCount} tags...`)
    const result = await tagTransaction.commit()
    console.log('Tag migration completed successfully!')
    console.log(`- Migrated: ${migratedCount} tags`)
    console.log(`- Already migrated: ${alreadyMigratedCount} tags`)
    
  } catch (error) {
    console.error('Error during migration:', error)
  }
}

// Execute the migration
migrateCocktailTags() 