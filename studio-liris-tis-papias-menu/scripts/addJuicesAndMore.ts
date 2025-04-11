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

const juicesAndMore = [
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Cold Chocolate',
      gr: 'Κρύα Σοκολάτα'
    },
    description: {
      en: 'Refreshing cold chocolate drink',
      gr: 'Δροσιστική κρύα σοκολάτα'
    },
    price: 3.50,
    category: 'juices',
    orderRank: 10
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Hot Chocolate',
      gr: 'Ζεστή Σοκολάτα'
    },
    description: {
      en: 'Classic hot chocolate',
      gr: 'Κλασική ζεστή σοκολάτα'
    },
    price: 3.50,
    category: 'juices',
    orderRank: 20
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Orange & Banana Juice',
      gr: 'Χυμός Πορτοκάλι & Μπανάνα'
    },
    description: {
      en: 'Fresh orange juice with banana',
      gr: 'Φρέσκος χυμός πορτοκάλι με μπανάνα'
    },
    price: 4.00,
    category: 'juices',
    orderRank: 30
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Orange Juice',
      gr: 'Χυμός Πορτοκάλι'
    },
    description: {
      en: 'Fresh orange juice',
      gr: 'Φρέσκος χυμός πορτοκάλι'
    },
    price: 3.00,
    category: 'juices',
    orderRank: 40
  }
]

async function addJuicesAndMore() {
  try {
    const transaction = client.transaction()
    juicesAndMore.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add juices and more items...')
    const result = await transaction.commit()
    console.log('Successfully added all juices and more items!', result)
  } catch (error) {
    console.error('Error adding juices and more items:', error)
  }
}

addJuicesAndMore() 