import type { CategorySlug } from '@/types'

// 30 unique Unsplash images per category — no cross-category duplicates
const CATEGORY_IMAGES: Record<CategorySlug, string[]> = {
  veterinarians: [
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548751218-4ca5fea79a90?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1505628346881-b72b27e84af0?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop&crop=entropy',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
  ],
  emergency_vets: [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548751218-4ca5fea79a90?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1505628346881-b72b27e84af0?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80&fit=crop',
  ],
  groomers: [
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1581888227599-779811939961?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1602584386319-fa8eb4361c2c?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1610041321420-a596dd14ebc9?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1488839329991-c7d6aab0c2e2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1608096299210-db7e38487075?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
  ],
  boarding: [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1547623542-de3ff5941ddb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1488839329991-c7d6aab0c2e2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1608096299210-db7e38487075?w=800&q=80&fit=crop',
  ],
  daycare: [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop&crop=top',
    'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1488839329991-c7d6aab0c2e2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1547623542-de3ff5941ddb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=800&q=80&fit=crop',
  ],
  trainers: [
    'https://images.unsplash.com/photo-1546421845-6471bdcf3edf?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1551717743-d91257a4921c?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1575213375682-3c8ab0e3ec97?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1491604612772-6853927639ef?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1487300610085-212a0e58b8ed?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1488839329991-c7d6aab0c2e2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1608096299210-db7e38487075?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1547623542-de3ff5941ddb?w=800&q=80&fit=crop',
  ],
  pet_pharmacies: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19f4434a5b96?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1552053831-71594a27aa68?w=800&q=80&fit=crop&crop=top',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1460627390041-532a28402358?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1488839329991-c7d6aab0c2e2?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80&fit=crop',
    'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=800&q=80&fit=crop',
  ],
}

function deterministicIndex(slug: string, poolLength: number): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return hash % poolLength
}

export function getProviderImage(heroImage: string | null, category: CategorySlug, slug: string): string {
  if (heroImage) return heroImage
  const pool = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.veterinarians
  return pool[deterministicIndex(slug, pool.length)]
}

/**
 * Assigns images to a list of providers, guaranteeing no two providers in the
 * same rendered list share the same image — even if the category pool is small.
 */
export function assignProviderImages(
  providers: Array<{ slug: string; hero_image: string | null; category: CategorySlug }>
): string[] {
  const usedUrls = new Set<string>()
  const usedPoolIdx: Record<string, Set<number>> = {}

  return providers.map(p => {
    const pool = CATEGORY_IMAGES[p.category] ?? CATEGORY_IMAGES.veterinarians
    const key = p.category
    if (!usedPoolIdx[key]) usedPoolIdx[key] = new Set()

    // Use real Google photo if available and not already shown on this page
    if (p.hero_image && !usedUrls.has(p.hero_image)) {
      usedUrls.add(p.hero_image)
      return p.hero_image
    }

    // Fall back to pool with collision avoidance
    let idx = deterministicIndex(p.slug, pool.length)
    let attempts = 0
    while (attempts < pool.length) {
      const url = pool[idx]
      if (!usedUrls.has(url) && !usedPoolIdx[key].has(idx)) break
      idx = (idx + 1) % pool.length
      attempts++
    }
    usedPoolIdx[key].add(idx)
    usedUrls.add(pool[idx])
    return pool[idx]
  })
}

export function getCategoryBannerImage(category: CategorySlug): string {
  const pool = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.veterinarians
  return pool[0]
}
