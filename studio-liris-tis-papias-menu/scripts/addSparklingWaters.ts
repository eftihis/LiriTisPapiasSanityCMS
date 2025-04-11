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

const sparklingWaters = [
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Mastiqua Water',
      gr: 'Νερό Mastiqua'
    },
    description: {
      en: 'Natural sparkling water with mastiha',
      gr: 'Φυσικό ανθρακούχο νερό με μαστίχα'
    },
    price: 4.00,
    category: 'sparkling-waters',
    orderRank: 10
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Mastiqua Water Cucumber',
      gr: 'Νερό Mastiqua με Αγγούρι'
    },
    description: {
      en: 'Sparkling water with mastiha and cucumber',
      gr: 'Ανθρακούχο νερό με μαστίχα και αγγούρι'
    },
    price: 4.00,
    category: 'sparkling-waters',
    orderRank: 20
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Mastiqua Water Lemon',
      gr: 'Νερό Mastiqua με Λεμόνι'
    },
    description: {
      en: 'Sparkling water with mastiha and lemon',
      gr: 'Ανθρακούχο νερό με μαστίχα και λεμόνι'
    },
    price: 4.00,
    category: 'sparkling-waters',
    orderRank: 30
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'S.Pellegrino',
      gr: 'S.Pellegrino'
    },
    description: {
      en: 'Italian sparkling mineral water',
      gr: 'Ιταλικό ανθρακούχο μεταλλικό νερό'
    },
    price: 4.00,
    category: 'sparkling-waters',
    orderRank: 40
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Souroti',
      gr: 'Σουρωτή'
    },
    description: {
      en: 'Greek natural sparkling mineral water',
      gr: 'Ελληνικό φυσικό ανθρακούχο μεταλλικό νερό'
    },
    price: 3.50,
    category: 'sparkling-waters',
    orderRank: 50
  }
]

async function addSparklingWaters() {
  try {
    const transaction = client.transaction()
    sparklingWaters.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add sparkling water items...')
    const result = await transaction.commit()
    console.log('Successfully added all sparkling water items!', result)
  } catch (error) {
    console.error('Error adding sparkling water items:', error)
  }
}

addSparklingWaters() 