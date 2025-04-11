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

type BeerItem = {
  _type: string
  title: {
    en: string
    gr: string
  }
  beerType: string
  description?: {
    en?: string
    gr?: string
  }
  size: number
  price: number
  orderRank: number
}

const beerItems: BeerItem[] = [
  // Greek Beers
  {
    _type: 'beerItem',
    title: {
      en: 'Latina Blond',
      gr: 'Latina Blond'
    },
    beerType: 'local',
    description: {
      en: 'Greek Beer',
      gr: 'Ελληνική Μπύρα'
    },
    size: 330,
    price: 5.00,
    orderRank: 10
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Voreia IPA',
      gr: 'Voreia IPA'
    },
    beerType: 'local',
    description: {
      en: 'Greek Beer',
      gr: 'Ελληνική Μπύρα'
    },
    size: 330,
    price: 6.50,
    orderRank: 20
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Voreia Stout',
      gr: 'Voreia Stout'
    },
    beerType: 'local',
    description: {
      en: 'Greek Beer',
      gr: 'Ελληνική Μπύρα'
    },
    size: 330,
    price: 7.00,
    orderRank: 30
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Voreia Wit',
      gr: 'Voreia Wit'
    },
    beerType: 'local',
    description: {
      en: 'Greek Beer',
      gr: 'Ελληνική Μπύρα'
    },
    size: 330,
    price: 6.00,
    orderRank: 40
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Mamos Pils',
      gr: 'Mamos Pils'
    },
    beerType: 'local',
    description: {
      en: 'Greek Beer',
      gr: 'Ελληνική Μπύρα'
    },
    size: 330,
    price: 3.00,
    orderRank: 50
  },
  
  // Imported Beers
  {
    _type: 'beerItem',
    title: {
      en: 'Brand Pilsner Draught 250ml',
      gr: 'Brand Pilsner Draught 250ml'
    },
    beerType: 'imported',
    description: {
      en: 'Imported Beer',
      gr: 'Εισαγόμενη Μπύρα'
    },
    size: 250,
    price: 3.50,
    orderRank: 60
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Brand Pilsner Draught 500ml',
      gr: 'Brand Pilsner Draught 500ml'
    },
    beerType: 'imported',
    description: {
      en: 'Imported Beer',
      gr: 'Εισαγόμενη Μπύρα'
    },
    size: 500,
    price: 5.50,
    orderRank: 70
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Stella Artois',
      gr: 'Stella Artois'
    },
    beerType: 'imported',
    description: {
      en: 'Imported Beer',
      gr: 'Εισαγόμενη Μπύρα'
    },
    size: 330,
    price: 5.00,
    orderRank: 80
  },
  {
    _type: 'beerItem',
    title: {
      en: 'Stella Artois Free',
      gr: 'Stella Artois Free'
    },
    beerType: 'imported',
    description: {
      en: 'Non-alcoholic Imported Beer',
      gr: 'Εισαγόμενη Μπύρα Χωρίς Αλκοόλ'
    },
    size: 330,
    price: 5.00,
    orderRank: 90
  }
];

async function addBeerItems() {
  try {
    const transaction = client.transaction()
    beerItems.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add beer items...')
    const result = await transaction.commit()
    console.log('Successfully added all beer items!', result)
  } catch (error) {
    console.error('Error adding beer items:', error)
  }
}

addBeerItems() 