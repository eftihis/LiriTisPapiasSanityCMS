import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Debug: Check if token is loaded
console.log('Token loaded:', process.env.SANITY_TOKEN ? 'Yes' : 'No')

if (!process.env.SANITY_TOKEN) {
  console.error('No token found in environment variables!')
  process.exit(1)
}

// Initialize the client
const client = createClient({
  projectId: 'ivfy9y3f',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-19',
  token: process.env.SANITY_TOKEN
})

// Coffee items data
const coffeeItems = [
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Espresso Single',
      gr: 'Μονός Εσπρέσσο'
    },
    description: {
      en: 'Single shot of espresso',
      gr: 'Μονός εσπρέσσο'
    },
    price: 2.50,
    category: 'coffee',
    orderRank: 10
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Espresso Double',
      gr: 'Διπλός Εσπρέσσο'
    },
    description: {
      en: 'Double shot of espresso',
      gr: 'Διπλός εσπρέσσο'
    },
    price: 3.00,
    category: 'coffee',
    orderRank: 20
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Espresso Americano',
      gr: 'Εσπρέσσο Αμερικάνο'
    },
    description: {
      en: 'Espresso with hot water',
      gr: 'Εσπρέσσο με ζεστό νερό'
    },
    price: 3.50,
    category: 'coffee',
    orderRank: 30
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Espresso Macchiato',
      gr: 'Εσπρέσσο Μακιάτο'
    },
    description: {
      en: 'Espresso with a dash of milk foam',
      gr: 'Εσπρέσσο με λίγο αφρόγαλα'
    },
    price: 3.00,
    category: 'coffee',
    orderRank: 40
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Cappuccino Single',
      gr: 'Μονός Καπουτσίνο'
    },
    description: {
      en: 'Single shot cappuccino',
      gr: 'Μονός καπουτσίνο'
    },
    price: 3.00,
    category: 'coffee',
    orderRank: 50
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Cappuccino Double',
      gr: 'Διπλός Καπουτσίνο'
    },
    description: {
      en: 'Double shot cappuccino',
      gr: 'Διπλός καπουτσίνο'
    },
    price: 3.50,
    category: 'coffee',
    orderRank: 60
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Filter Coffee',
      gr: 'Καφές Φίλτρου'
    },
    description: {
      en: 'Classic filter coffee',
      gr: 'Κλασικός καφές φίλτρου'
    },
    price: 2.50,
    category: 'coffee',
    orderRank: 70
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Cafe Latte',
      gr: 'Καφέ Λάτε'
    },
    description: {
      en: 'Espresso with steamed milk',
      gr: 'Εσπρέσσο με ζεστό γάλα'
    },
    price: 3.50,
    category: 'coffee',
    orderRank: 80
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Greek Coffee Single',
      gr: 'Μονός Ελληνικός Καφές'
    },
    description: {
      en: 'Traditional Greek coffee',
      gr: 'Παραδοσιακός ελληνικός καφές'
    },
    price: 2.00,
    category: 'coffee',
    orderRank: 90
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Greek Coffee Double',
      gr: 'Διπλός Ελληνικός Καφές'
    },
    description: {
      en: 'Double Greek coffee',
      gr: 'Διπλός ελληνικός καφές'
    },
    price: 2.00,
    category: 'coffee',
    orderRank: 100
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Irish Coffee',
      gr: 'Ιρλανδικός Καφές'
    },
    description: {
      en: 'Coffee with Irish whiskey and cream',
      gr: 'Καφές με ιρλανδέζικο ουίσκι και κρέμα'
    },
    price: 6.00,
    category: 'coffee',
    orderRank: 110
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Freddo Espresso',
      gr: 'Φρέντο Εσπρέσσο'
    },
    description: {
      en: 'Iced espresso',
      gr: 'Κρύος εσπρέσσο'
    },
    price: 3.00,
    category: 'coffee',
    orderRank: 120
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Freddo Cappuccino',
      gr: 'Φρέντο Καπουτσίνο'
    },
    description: {
      en: 'Iced cappuccino',
      gr: 'Κρύος καπουτσίνο'
    },
    price: 3.50,
    category: 'coffee',
    orderRank: 130
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Frappe',
      gr: 'Φραπέ'
    },
    description: {
      en: 'Traditional Greek iced coffee',
      gr: 'Παραδοσιακός ελληνικός κρύος καφές'
    },
    price: 2.50,
    category: 'coffee',
    orderRank: 140
  }
]

// Function to add all coffee items
async function addCoffeeItems() {
  try {
    // Create all items in a transaction
    const transaction = client.transaction()
    
    coffeeItems.forEach((item) => {
      transaction.create(item)
    })
    
    console.log('Starting to add coffee items...')
    const result = await transaction.commit()
    console.log('Successfully added all coffee items!', result)
  } catch (error) {
    console.error('Error adding coffee items:', error)
  }
}

// Run the function
addCoffeeItems() 