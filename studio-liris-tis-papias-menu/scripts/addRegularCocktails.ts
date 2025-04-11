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

// Define the types for our cocktail items
type CocktailBase = {
  _type: string;
  title: { en: string; gr: string };
  price: number;
  category: string;
  orderRank: number;
}

type CocktailWithDescription = CocktailBase & {
  description: { en: string; gr: string };
}

type CocktailWithoutDescription = CocktailBase & {
  description?: undefined;
}

type CocktailItem = CocktailWithDescription | CocktailWithoutDescription;

const regularCocktails: CocktailItem[] = [
  // Classics Category
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Americano',
      gr: 'Americano'
    },
    price: 9.00,
    category: 'classics',
    orderRank: 10
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Dry Martini',
      gr: 'Dry Martini'
    },
    price: 9.50,
    category: 'classics',
    orderRank: 20
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Espresso Martini',
      gr: 'Espresso Martini'
    },
    price: 9.50,
    category: 'classics',
    orderRank: 30
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Negroni',
      gr: 'Negroni'
    },
    price: 9.50,
    category: 'classics',
    orderRank: 40
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Old Fashioned',
      gr: 'Old Fashioned'
    },
    price: 10.00,
    category: 'classics',
    orderRank: 50
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Rum Fashioned',
      gr: 'Rum Fashioned'
    },
    price: 10.00,
    category: 'classics',
    orderRank: 60
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Paloma',
      gr: 'Paloma'
    },
    price: 10.00,
    category: 'classics',
    orderRank: 70
  },

  // G&T Category
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Boatyard',
      gr: 'Boatyard'
    },
    price: 10.00,
    description: {
      en: 'Boatyard gin, juniper, ring slice grapefruit, bitter grapefruit',
      gr: 'Boatyard gin, juniper, ring slice grapefruit, bitter grapefruit'
    },
    category: 'g_and_t',
    orderRank: 10
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Gin Raw',
      gr: 'Gin Raw'
    },
    price: 14.00,
    description: {
      en: 'Gin Raw, Fever Tree Indian tonic, lime leaves, bitter ginger',
      gr: 'Gin Raw, Fever Tree Indian tonic, lime leaves, bitter ginger'
    },
    category: 'g_and_t',
    orderRank: 20
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Grace',
      gr: 'Grace'
    },
    price: 11.00,
    description: {
      en: 'Grace gin, Fever Tree Indian tonic, lime peel, thyme',
      gr: 'Grace gin, Fever Tree Indian tonic, lime peel, thyme'
    },
    category: 'g_and_t',
    orderRank: 30
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Mataroa',
      gr: 'Mataroa'
    },
    price: 10.00,
    description: {
      en: 'Mataroa gin, peel of lemon, Schweppes Indian tonic, juniper berries',
      gr: 'Mataroa gin, peel of lemon, Schweppes Indian tonic, juniper berries'
    },
    category: 'g_and_t',
    orderRank: 40
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Mataroa Pink',
      gr: 'Mataroa Pink'
    },
    price: 9.50,
    description: {
      en: 'Mataroa Pink gin, strawberry, Schweppes Indian tonic, peachy orange bitter',
      gr: 'Mataroa Pink gin, strawberry, Schweppes Indian tonic, peachy orange bitter'
    },
    category: 'g_and_t',
    orderRank: 50
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Nuage',
      gr: 'Nuage'
    },
    price: 10.00,
    description: {
      en: 'Nuage gin, Schweppes Indian tonic, lemon peel, raspberry',
      gr: 'Nuage gin, Schweppes Indian tonic, lemon peel, raspberry'
    },
    category: 'g_and_t',
    orderRank: 60
  },

  // Spritz Category
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Aperol Fresh',
      gr: 'Aperol Fresh'
    },
    price: 8.00,
    category: 'spritz',
    orderRank: 10
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Aperol Smash',
      gr: 'Aperol Smash'
    },
    price: 9.00,
    category: 'spritz',
    orderRank: 20
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Aperol Spritz',
      gr: 'Aperol Spritz'
    },
    price: 7.00,
    category: 'spritz',
    orderRank: 30
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Hugo',
      gr: 'Hugo'
    },
    price: 7.00,
    category: 'spritz',
    orderRank: 40
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Lilet Spritz Blanco',
      gr: 'Lilet Spritz Blanco'
    },
    price: 7.00,
    category: 'spritz',
    orderRank: 50
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Lilet Spritz Rose',
      gr: 'Lilet Spritz Rose'
    },
    price: 7.00,
    category: 'spritz',
    orderRank: 60
  },

  // Tropical Touch Category
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Daquiri Lemon',
      gr: 'Daquiri Lemon'
    },
    price: 9.00,
    category: 'tropical_touch',
    orderRank: 10
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Margarita',
      gr: 'Margarita'
    },
    price: 9.50,
    category: 'tropical_touch',
    orderRank: 20
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Mai Tai',
      gr: 'Mai Tai'
    },
    price: 10.50,
    category: 'tropical_touch',
    orderRank: 30
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Pali Tiki',
      gr: 'Pali Tiki'
    },
    price: 12.00,
    category: 'tropical_touch',
    orderRank: 40
  },
  {
    _type: 'regularCocktailItem',
    title: {
      en: 'Pornstar',
      gr: 'Pornstar'
    },
    price: 9.00,
    category: 'tropical_touch',
    orderRank: 50
  }
]

async function addRegularCocktails() {
  try {
    const transaction = client.transaction()
    
    for (const item of regularCocktails) {
      // @ts-ignore - We need to bypass the type check here since we can't match Sanity's exact types
      transaction.create(item)
    }
    
    console.log('Starting to add regular cocktail items...')
    const result = await transaction.commit()
    console.log('Successfully added all regular cocktail items!', result)
  } catch (error) {
    console.error('Error adding regular cocktail items:', error)
  }
}

addRegularCocktails()
