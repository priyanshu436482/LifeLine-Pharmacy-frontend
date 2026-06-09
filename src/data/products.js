import Img1 from './madisince/Paracetamol 500mg Tablets.jpeg'
import Img2 from './madisince/Cetirizine 10mg Tablets.jpeg'
import Img3 from './madisince/Dolo 650 Tablet.jpeg'
import Img4 from './madisince/bicasol capsule.jpeg'
import Img5 from './madisince/Supradyn Daily Tablet.jpeg'
import Img6 from './madisince/limcee tablet.jpeg'
import Img7 from './madisince/Hand Sanitizer 500ml.jpeg'
import Img8 from './madisince/Multivitamin Daily Capsules.jpeg'
import Img9 from './madisince/Amoxicillin 500mg Capsules.jpeg'
import Img10 from './madisince/Omega-3 Fish Oil Softgels.jpeg'
import Img11 from './madisince/Dytor 40 Tablet.jpeg'
import Img12 from './madisince/Face Mask Pack of 50.jpeg'
const Img13 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0P-TawDsoseugG1-JM5zDKEgN5f2hs5Eexw&s'
const Img14 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrgC4yFIiN3KQ6Yjxy1OXUw6BAosifrVubGA&s'
const Img15 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzB_imXN5B01swYJaixUNOd6QqpYLIWtNOUg&s'
const Img16 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMewbTqH8mxZzgczPVhvtW6P6zWNvFgRHog&s'
const Img17 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUInt6zJDarUQB2S1gIhMPuF0CH7_SAarIFw&s'
const Img18 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1HGAntWN964Y2JG4uI6-1taEpeQH8j4whfw&s'
const Img19 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeDZyoloTW0sBksqLY9A-VwGZJBGvECavEhQ&s'
const Img20 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGxLCBT06BfGT5-gvTOJ0AynxYcaWZNwrsUw&s'
const Img21 = 'http://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgAVliyLRVLWEdAbTMOI_q7ejB70KAMKf4hA&s'
const Img22 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWBZzNjFiBGcjjuRD37_x4kS7pVJwyfv53A&s'
const Img23 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9_j8_pyqjneFedot8LYEx2EnEWk3Qk1bJHw&s'
const Img24 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5lNGLDCipdftp-KRlC6prCoRzq9i7QcBA-w&s'
const Img25 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMndr4NisGPxo7XbTjE_vKcek2ZAfPY9gz5A&s'
const Img26 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR12dbKuuuOWXPljBo3krpkwSO0Bv-WkVh0hQ&s'
const Img27 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE2jycOhSgyvssMLzLg6tg4_MBMdzb6fQg4w&s'
const Img28 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR909YZndR0XlrKnyMHTJqyvBiTDSphgLf0yg&s'
const Img29 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf3HpV6ySo2jK15aTPZndjo-x83Q6mRGjGgQ&s'
const Img30 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrk0sw5FnvgLX-4lO8WDSZSnRxaztH-AANJA&s'
const Img31 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMDWlisRAQEoUd8mYvwvtbXVrzUePS1SABZA&s'
const Img32 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMewbTqH8mxZzgczPVhvtW6P6zWNvFgRHog&s'

export const categories = [
  { id: 'medicines', name: 'Medicines', icon: '💊', path: '/products' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', path: '/products' },
  { id: 'lab-tests', name: 'Lab Tests', icon: '🔬', path: '/products' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', path: '/products' },
]

export const products = [
  { id: 1, name: 'Paracetamol 500mg Tablets', price: 45, image: Img1, slug: 'paracetamol', category: 'medicines' },
  { id: 2, name: 'Cetirizine 10mg Tablets', price: 32, image: Img2, slug: 'cetirizine', category: 'medicines' },
  { id: 3, name: 'Dolo 650 Tablet', price: 28, image: Img3, slug: 'dolo-650', category: 'medicines' },
  { id: 4, name: 'bicasol capsule', price: 199, image: Img4, slug: 'vitamin-d3', category: 'healthcare' },
  { id: 5, name: 'Supradyn Daily Tablet', price: 899, image: Img5, slug: 'bp-monitor', category: 'healthcare' },
  { id: 6, name: 'limcee tablet ', price: 299, image: Img6, slug: 'cbc-test', category: 'lab-tests' },
  { id: 7, name: 'Hand Sanitizer 500ml', price: 149, image: Img7, slug: 'hand-sanitizer', category: 'personal-care' },
  { id: 8, name: 'Multivitamin Daily Capsules', price: 349, image: Img8, slug: 'multivitamin', category: 'healthcare' },
  { id: 9, name: 'Amoxicillin 500mg Capsules', price: 85, image: Img9, slug: 'amoxicillin', category: 'medicines' },
  { id: 10, name: 'Omega-3 Fish Oil Softgels', price: 425, image: Img10, slug: 'omega-3', category: 'healthcare' },
  { id: 11, name: 'Dytor 40 Tablet', price: 449, image: Img11, slug: 'thyroid-test', category: 'lab-tests' },
  { id: 12, name: 'Face Mask Pack of 5', price: 199, image: Img12, slug: 'face-mask', category: 'personal-care' },
  { id: 13, name: 'Ibuprofen 400 Tablet', price: 60, image: Img13, slug: 'ibuprofen', category: 'medicines' },
  { id: 14, name: 'Crocin Advance Tablet', price: 35, image: Img14, slug: 'crocin-advance', category: 'medicines' },
  { id: 15, name: 'Combiflam Tablet', price: 50, image: Img15, slug: 'combiflam', category: 'medicines' },
  { id: 16, name: 'Aspirin Tablet', price: 25, image: Img16, slug: 'aspirin', category: 'medicines' },
  { id: 17, name: 'Levocetirizine Tablet', price: 40, image: Img17, slug: 'levocetirizine', category: 'medicines' },
  { id: 18, name: 'Montelukast Tablet', price: 75, image: Img18, slug: 'montelukast', category: 'medicines' },
  { id: 19, name: 'Allegra 120 Tablet', price: 120, image: Img19, slug: 'allegra-120', category: 'medicines' },
  { id: 20, name: 'Sinarest Tablet', price: 55, image: Img20, slug: 'sinarest', category: 'medicines' },
  { id: 21, name: 'Azithromycin 500 Tablet', price: 110, image: Img21, slug: 'azithromycin', category: 'medicines' },
  { id: 22, name: 'Ciprofloxacin 500 Tablet', price: 95, image: Img22, slug: 'ciprofloxacin', category: 'medicines' },
  { id: 23, name: 'Doxycycline Capsule', price: 80, image: Img23, slug: 'doxycycline', category: 'medicines' },
  { id: 24, name: 'Vitamin B Complex Tablet', price: 65, image: Img24, slug: 'vitamin-b-complex', category: 'healthcare' },
  { id: 25, name: 'Vitamin C Tablet', price: 45, image: Img25, slug: 'vitamin-c', category: 'healthcare' },
  { id: 26, name: 'Calcium + Vitamin D3 Tablet', price: 150, image: Img26, slug: 'calcium-d3', category: 'healthcare' },
  { id: 27, name: 'Zincovit Tablet', price: 95, image: Img27, slug: 'zincovit', category: 'healthcare' },
  { id: 28, name: 'Dettol Antiseptic Liquid', price: 120, image: Img28, slug: 'dettol', category: 'personal-care' },
  { id: 29, name: 'Savlon Antiseptic Cream', price: 85, image: Img29, slug: 'savlon', category: 'personal-care' },
  { id: 30, name: 'Betadine Ointment', price: 90, image: Img30, slug: 'betadine', category: 'personal-care' },
  { id: 31, name: 'Digene Antacid Tablet', price: 45, image: Img31, slug: 'digene', category: 'medicines' },
  { id: 32, name: 'ORS Electrolyte Powder', price: 30, image: Img32, slug: 'ors', category: 'healthcare' },
  

]
