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

const teaItems = [
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Black Tea',
      gr: 'Μαύρο Τσάι'
    },
    description: {
      en: 'Classic black tea',
      gr: 'Κλασικό μαύρο τσάι'
    },
    price: 2.80,
    category: 'tea',
    orderRank: 10
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Chamomile',
      gr: 'Χαμομήλι'
    },
    description: {
      en: 'Soothing chamomile tea',
      gr: 'Χαλαρωτικό τσάι χαμομηλιού'
    },
    price: 2.80,
    category: 'tea',
    orderRank: 20
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Dictamon Tea',
      gr: 'Τσάι Δίκταμο'
    },
    description: {
      en: 'Traditional Cretan herb tea',
      gr: 'Παραδοσιακό κρητικό βότανο'
    },
    price: 2.80,
    category: 'tea',
    orderRank: 30
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Earl Grey',
      gr: 'Έρλ Γκρέι'
    },
    description: {
      en: 'Black tea flavored with bergamot oil',
      gr: 'Μαύρο τσάι αρωματισμένο με περγαμόντο'
    },
    price: 2.80,
    category: 'tea',
    orderRank: 40
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Green Tea',
      gr: 'Πράσινο Τσάι'
    },
    description: {
      en: 'Classic green tea',
      gr: 'Κλασικό πράσινο τσάι'
    },
    price: 2.80,
    category: 'tea',
    orderRank: 50
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Lord Byron Citrus Blend',
      gr: 'Μείγμα Εσπεριδοειδών Lord Byron'
    },
    description: {
      en: 'Special citrus tea blend',
      gr: 'Ειδικό μείγμα τσαγιού με εσπεριδοειδή'
    },
    price: 2.80,
    category: 'tea',
    orderRank: 60
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Mountain Tea',
      gr: 'Τσάι του Βουνού'
    },
    description: {
      en: 'Traditional Greek mountain tea',
      gr: 'Παραδοσιακό ελληνικό τσάι του βουνού'
    },
    price: 3.00,
    category: 'tea',
    orderRank: 70
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Sage Tea',
      gr: 'Τσάι Φασκόμηλο'
    },
    description: {
      en: 'Aromatic sage tea',
      gr: 'Αρωματικό τσάι φασκόμηλου'
    },
    price: 3.00,
    category: 'tea',
    orderRank: 80
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Mastiha Tea',
      gr: 'Τσάι Μαστίχας'
    },
    description: {
      en: 'Tea with Chios mastiha',
      gr: 'Τσάι με μαστίχα Χίου'
    },
    price: 3.00,
    category: 'tea',
    orderRank: 90
  },
  {
    _type: 'simpleMenuItem',
    title: {
      en: 'Red Square Tea',
      gr: 'Τσάι Red Square'
    },
    description: {
      en: 'Special red tea blend',
      gr: 'Ειδικό μείγμα κόκκινου τσαγιού'
    },
    price: 3.00,
    category: 'tea',
    orderRank: 100
  }
]

async function addTeaItems() {
  try {
    const transaction = client.transaction()
    teaItems.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add tea items...')
    const result = await transaction.commit()
    console.log('Successfully added all tea items!', result)
  } catch (error) {
    console.error('Error adding tea items:', error)
  }
}

addTeaItems() 