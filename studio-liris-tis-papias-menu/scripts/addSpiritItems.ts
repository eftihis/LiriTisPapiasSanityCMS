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

type SpiritItem = {
  _type: string
  title: {
    en: string
    gr: string
  }
  description?: {
    en?: string
    gr?: string
  }
  subCategory: string
  variants: {
    size: string,
    price: number
  }[]
  orderRank: number
}

const spiritItems: SpiritItem[] = [
  // VODKA
  {
    _type: 'spiritItem',
    title: {
      en: '42 Below',
      gr: '42 Below'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 10
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Absolut',
      gr: 'Absolut'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 20
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Absolut Citron',
      gr: 'Absolut Citron'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 30
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Beluga',
      gr: 'Beluga'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 40
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Belvedere',
      gr: 'Belvedere'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 50
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Crystal Head',
      gr: 'Crystal Head'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 60
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Grey Goose',
      gr: 'Grey Goose'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 70
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Ketel',
      gr: 'Ketel'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 80
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Nemiroff Deluxe',
      gr: 'Nemiroff Deluxe'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 90
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Regular X',
      gr: 'Regular X'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 0.00 }
    ],
    orderRank: 100
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Regular X Premium',
      gr: 'Regular X Premium'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 0.00 }
    ],
    orderRank: 110
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Stolichnaya',
      gr: 'Stolichnaya'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 120
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Zumbrowka',
      gr: 'Zumbrowka'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 130
  },
  
  // GIN
  {
    _type: 'spiritItem',
    title: {
      en: 'Bathtub',
      gr: 'Bathtub'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 200
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Beefeater 24',
      gr: 'Beefeater 24'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 210
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Boatyard',
      gr: 'Boatyard'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 220
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Boatyard Old Tom',
      gr: 'Boatyard Old Tom'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 230
  },
  {
    _type: 'spiritItem',
    title: {
      en: "Bobby's",
      gr: "Bobby's"
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 240
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Bombay Saphire',
      gr: 'Bombay Saphire'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 250
  },
  
  // TEQUILA
  {
    _type: 'spiritItem',
    title: {
      en: 'Altos Plata',
      gr: 'Altos Plata'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 400
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Calle 23 Blanco',
      gr: 'Calle 23 Blanco'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 410
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Calle 23 Reposado',
      gr: 'Calle 23 Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 20.00 }
    ],
    orderRank: 420
  },
  
  // MEZCAL
  {
    _type: 'spiritItem',
    title: {
      en: 'Mezcal Amores',
      gr: 'Mezcal Amores'
    },
    subCategory: 'mezcal',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 500
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Bruxo Elixir Des Los Terrenales',
      gr: 'Bruxo Elixir Des Los Terrenales'
    },
    subCategory: 'mezcal',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 510
  },
  
  // RUM
  {
    _type: 'spiritItem',
    title: {
      en: 'Angostura 1919',
      gr: 'Angostura 1919'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 600
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Bacardi White',
      gr: 'Bacardi White'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 610
  },
  
  // SPICED RUM
  {
    _type: 'spiritItem',
    title: {
      en: 'Angostura Taboo',
      gr: 'Angostura Taboo'
    },
    subCategory: 'spiced rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 700
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Bayou Spiced',
      gr: 'Bayou Spiced'
    },
    subCategory: 'spiced rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 710
  },
  
  // IRISH WHISKEY
  {
    _type: 'spiritItem',
    title: {
      en: 'Bushmils 10 Single Malt',
      gr: 'Bushmils 10 Single Malt'
    },
    subCategory: 'irish whiskey',
    variants: [
      { size: 'Glass', price: 15.00 }
    ],
    orderRank: 800
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Jameson',
      gr: 'Jameson'
    },
    subCategory: 'irish whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 810
  },
  
  // SCOTCH WHISKEY
  {
    _type: 'spiritItem',
    title: {
      en: 'Arran Single Malt',
      gr: 'Arran Single Malt'
    },
    subCategory: 'scotch whiskey',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 900
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Johnnie Walker Red Label',
      gr: 'Johnnie Walker Red Label'
    },
    subCategory: 'scotch whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 910
  },
  
  // BOURBON & RYE
  {
    _type: 'spiritItem',
    title: {
      en: 'Bulleit Bourbon',
      gr: 'Bulleit Bourbon'
    },
    subCategory: 'bourbon & rye',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1000
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Jack Daniels',
      gr: 'Jack Daniels'
    },
    subCategory: 'bourbon & rye',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1010
  },
  
  // COGNAC
  {
    _type: 'spiritItem',
    title: {
      en: 'Metaxa 3*',
      gr: 'Metaxa 3*'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 5.00 }
    ],
    orderRank: 1100
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Hennessy Very Special',
      gr: 'Hennessy Very Special'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1110
  },
  
  // LIQUEUR
  {
    _type: 'spiritItem',
    title: {
      en: 'Mastiha Skinos',
      gr: 'Mastiha Skinos'
    },
    subCategory: 'liqueur',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1200
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'St. Germain',
      gr: 'St. Germain'
    },
    subCategory: 'liqueur',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1210
  },
  
  // BITTERS
  {
    _type: 'spiritItem',
    title: {
      en: 'Amaro Montenegro',
      gr: 'Amaro Montenegro'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1300
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Campari',
      gr: 'Campari'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1310
  },
  
  // GREEK SPIRITS
  {
    _type: 'spiritItem',
    title: {
      en: 'Axia Mastiha',
      gr: 'Axia Mastiha'
    },
    subCategory: 'greek spirits',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1400
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Ouzo 12',
      gr: 'Ouzo 12'
    },
    subCategory: 'greek spirits',
    variants: [
      { size: 'Glass', price: 4.00 }
    ],
    orderRank: 1410
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Raki',
      gr: 'Raki'
    },
    subCategory: 'greek spirits',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1420
  },
  {
    _type: 'spiritItem',
    title: {
      en: 'Rakomelo',
      gr: 'Rakomelo'
    },
    subCategory: 'greek spirits',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 1430
  }
];

// Add more spirits... (this is a subset)

async function addSpiritItems() {
  try {
    const transaction = client.transaction()
    spiritItems.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add spirit items...')
    const result = await transaction.commit()
    console.log('Successfully added all spirit items!', result)
  } catch (error) {
    console.error('Error adding spirit items:', error)
  }
}

addSpiritItems() 