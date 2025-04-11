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

const softDrinks = [
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Coca Cola',
      gr: 'Coca Cola'
    },
    description: {
      en: 'Classic Coca Cola',
      gr: 'Κλασική Coca Cola'
    },
    price: 3.00,
    category: 'soft-drinks',
    orderRank: 10
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Coca Cola Zero',
      gr: 'Coca Cola Zero'
    },
    description: {
      en: 'Sugar-free Coca Cola',
      gr: 'Coca Cola χωρίς ζάχαρη'
    },
    price: 3.00,
    category: 'soft-drinks',
    orderRank: 20
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Fever Tree Indian Tonic',
      gr: 'Fever Tree Indian Tonic'
    },
    description: {
      en: 'Premium Indian tonic water',
      gr: 'Premium τόνικ νερό Indian'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 30
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Fever Tree Mediterranean Tonic',
      gr: 'Fever Tree Mediterranean Tonic'
    },
    description: {
      en: 'Premium Mediterranean tonic water',
      gr: 'Premium τόνικ νερό Mediterranean'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 40
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Gazoza',
      gr: 'Γκαζόζα'
    },
    description: {
      en: 'Traditional Greek lemonade soda',
      gr: 'Παραδοσιακή ελληνική γκαζόζα'
    },
    price: 3.00,
    category: 'soft-drinks',
    orderRank: 50
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Ginger Beer',
      gr: 'Ginger Beer'
    },
    description: {
      en: 'Spicy ginger beer',
      gr: 'Πικάντικη μπύρα τζίντζερ'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 60
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Grapefruit Soda',
      gr: 'Αναψυκτικό Γκρέιπφρουτ'
    },
    description: {
      en: 'Refreshing grapefruit soda',
      gr: 'Δροσιστικό αναψυκτικό γκρέιπφρουτ'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 70
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Homemade Lemonade - Lemon & Ginger',
      gr: 'Σπιτική Λεμονάδα - Λεμόνι & Τζίντζερ'
    },
    description: {
      en: 'Sugar-free homemade lemonade with ginger',
      gr: 'Σπιτική λεμονάδα χωρίς ζάχαρη με τζίντζερ'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 80
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Homemade Lemonade - Lemon & Mastiha',
      gr: 'Σπιτική Λεμονάδα - Λεμόνι & Μαστίχα'
    },
    description: {
      en: 'Sugar-free homemade lemonade with mastiha',
      gr: 'Σπιτική λεμονάδα χωρίς ζάχαρη με μαστίχα'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 90
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Homemade Lemonade - Strawberry, Cranberry & Buchu',
      gr: 'Σπιτική Λεμονάδα - Φράουλα, Κράνμπερι & Buchu'
    },
    description: {
      en: 'Homemade lemonade with berries and buchu',
      gr: 'Σπιτική λεμονάδα με μούρα και buchu'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 100
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Homemade Lemonade - Thyme',
      gr: 'Σπιτική Λεμονάδα - Θυμάρι'
    },
    description: {
      en: 'Homemade lemonade with thyme',
      gr: 'Σπιτική λεμονάδα με θυμάρι'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 110
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Lemonade',
      gr: 'Λεμονάδα'
    },
    description: {
      en: 'Classic lemonade',
      gr: 'Κλασική λεμονάδα'
    },
    price: 3.00,
    category: 'soft-drinks',
    orderRank: 120
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Orangeade',
      gr: 'Πορτοκαλάδα'
    },
    description: {
      en: 'Classic orangeade',
      gr: 'Κλασική πορτοκαλάδα'
    },
    price: 3.00,
    category: 'soft-drinks',
    orderRank: 130
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Raspberry Tonic',
      gr: 'Τόνικ Βατόμουρο'
    },
    description: {
      en: 'Tonic water with raspberry',
      gr: 'Τόνικ με βατόμουρο'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 140
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Thomas Henry Mystic Mango',
      gr: 'Thomas Henry Mystic Mango'
    },
    description: {
      en: 'Premium mango flavored soda',
      gr: 'Premium αναψυκτικό με γεύση μάνγκο'
    },
    price: 4.00,
    category: 'soft-drinks',
    orderRank: 150
  }
]

async function addSoftDrinks() {
  try {
    const transaction = client.transaction()
    softDrinks.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add soft drink items...')
    const result = await transaction.commit()
    console.log('Successfully added all soft drink items!', result)
  } catch (error) {
    console.error('Error adding soft drink items:', error)
  }
}

addSoftDrinks() 