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

type MenuItem = {
  _id: string
  title: {
    en: string
    gr: string
  }
  _type: string
  price?: number
  _createdAt: string
}

async function findAndRemoveDuplicates() {
  try {
    console.log('=== DUPLICATE MENU ITEMS CLEANUP UTILITY ===')
    
    // Define the schema types to check for duplicates
    const schemaTypes = [
      'juiceItem',
      'softDrinkItem',
      'sparklingWaterItem',
      'teaItem',
      'coffeeItem'
    ]
    
    for (const schemaType of schemaTypes) {
      console.log(`\nChecking for duplicates in ${schemaType}...`)
      
      // Fetch all items of this type
      const query = `*[_type == "${schemaType}"] | order(_createdAt asc)`
      const items: MenuItem[] = await client.fetch(query)
      
      console.log(`Found ${items.length} items of type ${schemaType}`)
      
      if (items.length <= 1) {
        console.log('No duplicates possible with only 0 or 1 items.')
        continue
      }
      
      // Group items by title
      const groupedByTitle: Record<string, MenuItem[]> = {}
      
      for (const item of items) {
        const titleKey = `${item.title.en.trim().toLowerCase()}`
        if (!groupedByTitle[titleKey]) {
          groupedByTitle[titleKey] = []
        }
        groupedByTitle[titleKey].push(item)
      }
      
      // Find duplicates
      const duplicateGroups = Object.entries(groupedByTitle)
        .filter(([_, group]) => group.length > 1)
        .map(([title, group]) => ({ title, items: group }))
      
      if (duplicateGroups.length === 0) {
        console.log('No duplicates found.')
        continue
      }
      
      console.log(`\nFound ${duplicateGroups.length} groups of duplicates:`)
      
      // Create a transaction for deletion
      const transaction = client.transaction()
      let totalToDelete = 0
      
      for (const group of duplicateGroups) {
        console.log(`\n${group.title}:`)
        
        // Sort items by creation date (oldest first)
        const sortedItems = group.items.sort((a, b) => 
          new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime()
        )
        
        // Keep the first item (oldest), mark the rest for deletion
        const keepItem = sortedItems[0]
        const deleteItems = sortedItems.slice(1)
        
        console.log(`  Keeping: ${keepItem._id} (created: ${keepItem._createdAt})`)
        console.log(`  Deleting ${deleteItems.length} duplicates:`)
        
        for (const item of deleteItems) {
          console.log(`    - ${item._id} (created: ${item._createdAt})`)
          transaction.delete(item._id)
          totalToDelete++
        }
      }
      
      if (totalToDelete > 0) {
        const confirmDeletion = await askQuestion(`\nDo you want to delete these ${totalToDelete} duplicate items from ${schemaType}?`)
        
        if (confirmDeletion) {
          console.log('Deleting duplicates...')
          await transaction.commit()
          console.log(`Successfully deleted ${totalToDelete} duplicate items.`)
        } else {
          console.log('Deletion cancelled.')
          transaction.reset()
        }
      }
    }
    
    console.log('\n=== DUPLICATE CLEANUP COMPLETED ===')
    rl.close()
    
  } catch (error) {
    console.error('Error during duplicate removal:', error)
    rl.close()
  }
}

// Run the cleanup
findAndRemoveDuplicates() 