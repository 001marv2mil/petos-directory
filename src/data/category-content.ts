/**
 * Category-level educational content for provider pages.
 * Adds unique, useful content to thin provider pages so Google
 * indexes them. Each category gets:
 *   - A guide paragraph (what to expect, how to choose)
 *   - 6 FAQs with answers (renders as FAQ schema.org rich snippets)
 *   - Related search queries (internal-link bait)
 */

export interface CategoryFAQ {
  question: string
  answer: string
}

export interface CategoryContent {
  /** Provider category slug — must match CATEGORIES in src/lib/constants.ts */
  category: string
  /** Heading shown above the educational guide on the provider page */
  guideHeading: string
  /** 150-word educational paragraph — unique per category */
  guide: string
  /** 6 FAQs answering common pet-owner questions for this category */
  faqs: CategoryFAQ[]
  /** Related search query phrases (used for internal-link block) */
  relatedQueries: string[]
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  veterinarians: {
    category: 'veterinarians',
    guideHeading: 'What to expect at a veterinarian',
    guide: 'A veterinarian is your pet\'s primary medical provider. Routine wellness visits typically include a physical exam, vaccination updates, parasite prevention, weight check, and a discussion of diet and behavior. New patient visits run 30 to 45 minutes; established patients usually 15 to 25. Bring vaccination records, a list of current medications, recent food brands, and notes on any symptoms you\'ve noticed in the last two weeks. A good vet will explain costs upfront, offer generic medication alternatives, and discuss preventive care that fits your budget. If your pet is showing signs of illness, call ahead so the staff can prepare and triage. For emergencies after hours, call the nearest 24/7 emergency vet rather than waiting for your regular practice to open.',
    faqs: [
      {
        question: 'How much does a routine vet visit cost?',
        answer: 'A routine wellness exam typically runs $50 to $250 in the US, depending on your location and the practice. Annual visits including core vaccines, parasite testing, and bloodwork range from $150 to $500. Specialist visits, emergency care, and surgery cost significantly more. Many vets offer wellness plans that bundle annual care for a flat monthly fee, which can be cheaper than paying per visit if your pet needs regular care.',
      },
      {
        question: 'What should I bring to my pet\'s first vet visit?',
        answer: 'Bring vaccination records (or a photo of the last vet receipt if you don\'t have paperwork), a list of any medications and supplements with dosages, the brand and amount of food you feed daily, notes on any symptoms or behavior changes from the past two weeks, and questions you want to ask. If your pet has been to a previous vet, request your records be sent ahead. A stool sample collected within four hours of the appointment is helpful if your vet asks for one.',
      },
      {
        question: 'How often should I take my pet to the vet?',
        answer: 'Healthy adult pets generally need an annual wellness visit. Puppies and kittens require multiple visits in their first year for vaccines and checkups, typically every three to four weeks until 16 weeks old, then a follow-up at one year. Senior pets (usually over age seven for dogs and cats) benefit from twice-yearly exams since health changes happen faster as pets age. Pets with chronic conditions like diabetes, kidney disease, or arthritis need more frequent monitoring as directed by your vet.',
      },
      {
        question: 'When should I take my pet to the vet vs. wait?',
        answer: 'Go immediately for difficulty breathing, collapse, seizures, severe bleeding, suspected poisoning, eye injuries, inability to urinate (especially male cats), bloating with a distended belly, repeated vomiting, or any trauma. Same-day appointment for limping that lasts more than a day, refusing food for over 24 hours, persistent diarrhea, sudden behavior changes, or new lumps. Routine appointment for mild appetite changes that resolve quickly, occasional soft stool, or minor skin issues. When in doubt, call your vet\'s nurse line — they can triage over the phone.',
      },
      {
        question: 'What questions should I ask the vet during a visit?',
        answer: 'Always ask: what is the cost of this test or treatment, what changes if results come back positive, is there a generic medication option, what side effects should I watch for in the first 48 hours, when should I call back versus return for a recheck, and what can I do at home to support recovery. Also ask about preventive screenings appropriate for your pet\'s breed and age. Get a written summary of the visit before you leave so you can review it later or share with another vet for a second opinion.',
      },
      {
        question: 'Do vets accept pet insurance?',
        answer: 'Most US vets accept pet insurance, but unlike human health insurance, pet insurance is reimbursement-based. You pay the vet directly at the visit, then submit the receipt and itemized invoice to your insurance company for reimbursement. Some major chains (like VCA and Banfield) have direct-pay arrangements with specific insurers. Always ask your vet for a detailed itemized invoice with diagnosis codes and procedure codes, since insurers require these for reimbursement.',
      },
    ],
    relatedQueries: [
      'Affordable vets near me',
      'Pet wellness plans',
      'Vets that accept pet insurance',
      'Low-cost vaccinations',
      'Senior pet vet care',
      'Fear-free vet practices',
    ],
  },

  emergency_vets: {
    category: 'emergency_vets',
    guideHeading: 'What to expect at an emergency vet',
    guide: 'Emergency vet hospitals operate 24/7 and treat life-threatening conditions that can\'t wait for a routine appointment. Common emergencies include traumas, suspected poisonings, breathing problems, seizures, severe bleeding, bloating with a distended abdomen, inability to urinate (especially in male cats), and collapse. Triage is by severity, not arrival order, so wait times can be long if your pet is stable. Costs are higher than routine vet visits because of overnight staffing, advanced equipment, and immediate diagnostics. Most emergency hospitals require a deposit of $300 to $1,500 upfront before treatment begins. Call ahead while driving so they can prepare. If your pet may have ingested something toxic, also call ASPCA Animal Poison Control at (888) 426-4435 ($95 consult fee) — they\'ll work directly with the hospital to guide treatment.',
    faqs: [
      {
        question: 'When is it a real pet emergency vs. wait until morning?',
        answer: 'Go to the emergency vet immediately for: difficulty breathing or labored breathing, collapse or unresponsiveness, seizures lasting longer than two minutes or repeated seizures, severe bleeding that won\'t stop, suspected poisoning (chocolate, xylitol, antifreeze, human medications, plants), inability to urinate (especially male cats — this is fatal within 24 to 48 hours), bloating with a hard distended belly (gastric torsion, fatal within hours), eye injuries or sudden blindness, severe trauma like being hit by a car, and uncontrolled vomiting or diarrhea with blood. Call the emergency line first if unsure — the staff can triage over the phone.',
      },
      {
        question: 'How much does an emergency vet visit cost?',
        answer: 'Emergency vet visits typically cost $300 to $5,000+ depending on what your pet needs. The initial exam alone usually runs $150 to $350. Diagnostics like x-rays, bloodwork, and ultrasound add $300 to $1,500. Overnight hospitalization runs $600 to $1,800 per night. Emergency surgery (like for bloat or a foreign object) often totals $3,000 to $8,000. Most emergency hospitals require a $300 to $1,500 deposit upfront. Ask for a written estimate before authorizing treatment, and ask about CareCredit or Scratchpay if cost is a concern.',
      },
      {
        question: 'What should I do before driving to the emergency vet?',
        answer: 'Call ahead so they can prepare equipment and triage by severity. Tell them your pet\'s species, breed, age, weight, what happened, current symptoms, and your ETA. If poisoning is suspected, bring the packaging or a sample of what was ingested. For trauma, transport on a flat board or in a sturdy box to keep the spine straight. Cover with a towel for warmth and to reduce panic. Apply pressure to bleeding wounds with a clean cloth — don\'t remove if soaked through. Do not give human medications, food, or water without veterinary guidance. Drive calmly. A second accident helps no one.',
      },
      {
        question: 'Will my regular vet handle the emergency or should I go straight to ER?',
        answer: 'During business hours, your regular vet can handle most emergencies — call first so they can prepare. After hours, weekends, and holidays, go directly to a 24/7 emergency hospital. Some general practices have on-call vets but limited equipment for complex cases. If your regular vet can\'t do diagnostic imaging, surgery, or overnight monitoring on-site, they\'ll send you to the ER anyway. For clear life-threatening emergencies (breathing problems, collapse, severe trauma), skip the regular vet and go straight to the ER even during business hours.',
      },
      {
        question: 'What if I can\'t afford emergency vet care?',
        answer: 'Several options exist. CareCredit and Scratchpay are veterinary-specific credit lines with no-interest payment plans for qualified applicants. Many ER hospitals accept these. Some non-profits help with emergency vet bills, including the Pet Fund, RedRover Relief, and breed-specific rescue groups. Call your local humane society — some have emergency funds for low-income owners. Veterinary teaching hospitals at universities often charge less than private ER hospitals. Some vets will work out payment plans for established clients. Never skip emergency care for a treatable condition because of cost without first asking — vets often have options.',
      },
      {
        question: 'How do I know if a pet emergency hospital is good?',
        answer: 'Look for board-certified specialists on staff (criticalists, surgeons, internal medicine), 24/7 in-house lab and imaging (not "we send out and wait for results"), AAHA accreditation (American Animal Hospital Association — voluntary high standard), Fear Free certification or low-stress handling protocols, transparent pricing with written estimates, and willingness to communicate with your regular vet. Read recent reviews focused on emergency situations specifically, not routine care. Ask if they have an isolation ward for contagious cases.',
      },
    ],
    relatedQueries: [
      '24 hour emergency vet near me',
      'Pet poison control hotline',
      'Affordable emergency vet care',
      'Pet ER deposit help',
      'Open vet clinics now',
      'After hours pet emergency',
    ],
  },

  groomers: {
    category: 'groomers',
    guideHeading: 'What to expect at a pet groomer',
    guide: 'Pet groomers handle bathing, haircuts, nail trims, ear cleaning, and coat-specific care. Full grooming appointments typically last two to four hours depending on coat type and the dog\'s temperament. Bring proof of current vaccinations (most groomers require rabies, DHPP, and Bordetella for dogs, FVRCP for cats). Show the groomer two or three reference photos of the cut you want — verbal descriptions like "puppy cut" mean different things at different shops. Ask the groomer to walk you through their process, see the back room if possible, and confirm whether they sedate or muzzle without calling first. Frequency depends on coat type: doodles and curly coats every four to six weeks, double coats every eight to twelve weeks (never shave), short coats every eight to twelve weeks for nail and ear maintenance, and cats every four to eight weeks for long-haired breeds.',
    faqs: [
      {
        question: 'How much does pet grooming cost?',
        answer: 'Full grooming runs $40 to $150+ for dogs depending on size, coat type, and location. Small dogs (under 25 lbs) typically $40 to $75. Medium dogs $50 to $90. Large dogs $75 to $150. Doodles, double-coated breeds, and matted dogs cost more due to extra time required. Cat grooming runs $50 to $120. Mobile groomers charge a 25 to 50 percent premium for the convenience. Add-ons like teeth brushing, nail grinding (vs. clipping), de-shedding treatments, and anal gland expression are typically $10 to $25 each.',
      },
      {
        question: 'How often should I have my pet groomed?',
        answer: 'Coat type determines cadence. Double-coated breeds (Husky, Golden Retriever, Australian Shepherd): every 8 to 12 weeks for full grooming, with weekly at-home brushing. Curly or non-shedding breeds (Doodles, Poodles, Bichons): every 4 to 6 weeks — these mat quickly if you skip. Long single-coat breeds (Yorkie, Maltese, Shih Tzu): every 4 to 6 weeks. Short single-coat breeds (Lab, Beagle, Boxer): every 8 to 12 weeks for nails, ears, and a thorough bath. Wire-coat breeds (Schnauzer, terriers): every 6 to 8 weeks. Cats: long-haired every 4 to 8 weeks, short-haired every 3 to 6 months.',
      },
      {
        question: 'Should I shave my dog in summer?',
        answer: 'Generally no — especially for double-coated breeds. The undercoat insulates against heat as well as cold, and shaving disrupts the natural cooling system. Shaved double-coats often grow back uneven, with damaged guard hairs that may never recover the original texture. Instead, ask for a thorough deshed and bath to remove dead undercoat. For single-coated breeds with thick or long hair, a summer trim is fine, but never shave to the skin — that exposes them to sunburn and bug bites.',
      },
      {
        question: 'How do I know if a groomer is good?',
        answer: 'Look for certifications (NDGAA, IPG, ICMG), recent positive reviews, willingness to give a tour of the back area, transparency about handling techniques and time estimates, breed-appropriate cuts (not shaving double-coats for "summer comfort"), and a "call before sedation or muzzling" policy. Red flags include refusing to let you see the work area, pushing add-on services aggressively, vague time windows ("we\'ll call when ready" with no estimate), nicks or razor burn on pickup, or your pet acting noticeably stressed afterward across multiple visits.',
      },
      {
        question: 'How can I get my pet used to grooming?',
        answer: 'Start at home as a puppy or kitten. Brush daily, even when the coat doesn\'t need it — make it a routine pleasant experience with treats. Touch and gently squeeze paws, ears, mouth, and tail several times a week. For first grooming visits, choose a slow-paced shop and ask for a "puppy intro" appointment that\'s mostly socialization, light bathing, and handling rather than a full cut. Bring high-value treats. Reward calm behavior. If your pet is showing significant stress at the groomer, ask about Fear Free certified groomers who specialize in low-stress handling.',
      },
      {
        question: 'What should I tell the groomer when I drop off?',
        answer: 'Show 2 to 3 reference photos of the cut you want. Specify length in inches if possible ("1 inch all over body, scissor finish on legs"). Note any sensitive areas (recent surgery sites, hot spots, sore hips). Mention specific anxieties (clippers, dryers, baths). Confirm you want sanitary trim, paw pad cleanup, ear cleaning, and nail trim — these are sometimes skipped if not requested explicitly. Ask the groomer to call before any sedation, muzzling, or significant change in plan. Provide a working phone number and a backup contact.',
      },
    ],
    relatedQueries: [
      'Mobile pet groomers near me',
      'Cat grooming services',
      'Doodle grooming',
      'Affordable dog grooming',
      'Aggressive dog groomers',
      'Senior dog grooming',
    ],
  },

  boarding: {
    category: 'boarding',
    guideHeading: 'What to expect at a pet boarding facility',
    guide: 'Pet boarding facilities provide overnight and extended-stay care while you travel. Quality boarders offer climate-controlled kennels, multiple daily potty breaks, supervised play (often with a small group), administer medications on schedule, and have a written emergency vet protocol. Tour the facility before booking — ask to see both the sleeping area and play area at a busy hour, not when it\'s empty. Required vaccinations typically include rabies, DHPP, and Bordetella for dogs, with canine influenza increasingly required. Bring enough food for the stay plus two extra days, current medications pre-portioned by day, a worn t-shirt or blanket from home, and emergency contact info for two people who can authorize vet care. After pickup, watch for stress signs in the first 48 hours: kennel cough, loose stool, hoarse bark, raw paw pads, or lingering anxiety.',
    faqs: [
      {
        question: 'How much does pet boarding cost?',
        answer: 'Standard kennel boarding runs $30 to $75 per night for dogs, $20 to $50 for cats. Luxury boarding with private suites, webcams, and group play can run $75 to $200+ per night. In-home pet sitter services through Rover or Wag typically $40 to $100 per night. Holidays (Christmas, Thanksgiving, summer) often have premium pricing of 25 to 50 percent extra. Add-ons: medication administration $5 to $15 per day, extra play sessions $10 to $25, departure baths $30 to $60.',
      },
      {
        question: 'What vaccinations does my pet need for boarding?',
        answer: 'Most boarders require rabies, DHPP (distemper combo), and Bordetella for dogs, with canine influenza (CIV-H3N2 and H3N8) increasingly required especially at facilities with group play. Bordetella must usually be administered at least 5 to 7 days before boarding. Cats typically need rabies and FVRCP. Some boarders also require fecal tests within the past 6 months. Bring printed vaccination records or have your vet email them ahead — most boarders won\'t accept handwritten records or phone-screenshot photos as primary documentation.',
      },
      {
        question: 'What should I pack for pet boarding?',
        answer: 'Pack their normal food (in original bag or with a photo of the brand label), enough for the stay plus 2 extra days. Pre-portion medications in a labeled pill organizer with written dosing instructions. Bring a worn t-shirt or unwashed blanket from home — your scent reduces stress. One familiar toy, not a brand-new one. Their normal collar with current ID tag plus a backup leash. Emergency contacts for you AND a backup person who can authorize vet care if you\'re unreachable. Boarders generally don\'t need beds, bowls, or cleaning supplies — they provide those.',
      },
      {
        question: 'How do I choose a good boarder?',
        answer: 'Tour the facility in person before booking. Ask the staff-to-pet ratio (especially overnight — more than 1 staff per 15 dogs is concerning). Ask how dogs are grouped (size, energy level, temperament). Ask about discipline and time-out protocols. Ask which emergency vet they use and whether they\'ve used them recently. Look for clean odor-free spaces, calm-but-engaged dogs in the play area, and staff who interact warmly with the pets. Read recent reviews — especially complaints — and watch for patterns. Avoid boarders who refuse a tour or won\'t answer specific questions.',
      },
      {
        question: 'Will my pet be okay at boarding?',
        answer: 'Most pets adjust within the first 24 hours, especially after a few stays at the same facility. Younger, social dogs often love it. Senior pets, anxious pets, and cats often do better with in-home pet sitters or a single-pet boarder rather than busy group facilities. Signs of healthy adjustment include eating, drinking, and pooping normally within 24 hours. Signs of struggle include refusing food for 48+ hours, hiding nonstop, or escalating anxiety. Ask the boarder to send daily photo updates so you can gauge how your pet is doing.',
      },
      {
        question: 'What stress signs should I watch for after boarding pickup?',
        answer: 'In the first 48 hours, watch for: excessive thirst or urination, loose stool or vomiting, refusing food, limping or new scrapes, hoarse bark (sign of excessive barking), coughing within 5 to 10 days (kennel cough — vaccinate next time), unusual lethargy or hyperactivity, fearfulness or aggression that wasn\'t there before. Mild fatigue and extra sleeping for 24 hours is normal. Anything beyond that, call the boarder and your regular vet. If your pet shows the same stress pattern across multiple boarding stays at the same facility, switch boarders.',
      },
    ],
    relatedQueries: [
      'Cheap pet boarding near me',
      'Cat boarding services',
      'Long-term pet boarding',
      'Last minute pet boarding',
      'Luxury dog boarding',
      'Pet sitters vs boarding',
    ],
  },

  daycare: {
    category: 'daycare',
    guideHeading: 'What to expect at dog daycare',
    guide: 'Dog daycare provides supervised group play during the day for social, healthy dogs. Quality daycares require an evaluation day before regular attendance to assess your dog\'s temperament, sociability, and play style. Required vaccinations typically include rabies, DHPP, Bordetella, and increasingly canine influenza. Spay/neuter is usually required for dogs over six to seven months. Daycares group dogs by size, energy level, and play style, with staff-to-dog ratios ideally below 1:15. Look for facilities that offer rest periods, not nonstop play (over-stimulation causes problems at home). Most dogs do best at 2 to 3 days per week — five days often leads to over-arousal, demand-barking, and difficulty settling. Watch your dog\'s body language at pickup: tired-but-loose is healthy, hard-eyed and wired is over-stimulated.',
    faqs: [
      {
        question: 'How much does dog daycare cost?',
        answer: 'Dog daycare typically runs $25 to $55 per day for full-day care, $15 to $30 for half-day. Multi-day packages reduce per-day cost, often dropping to $20 to $35 with a 10-day pass. Monthly unlimited memberships range $300 to $700. Premium facilities with smaller group sizes, webcams, and enrichment activities run $40 to $80 per day. Add-ons: daycare-bath combos $25 to $50, training during daycare $15 to $40, late pickup fees $1 per minute.',
      },
      {
        question: 'How do I prepare my dog for the daycare evaluation?',
        answer: 'Exercise them lightly that morning (a walk, not zoomies — they need to be receptive, not exhausted). Bring printed vaccination records: rabies, DHPP, Bordetella, often canine influenza. Confirm spay/neuter status. Use a flat collar with current ID — no prong, choke, or e-collars. Don\'t feed within 2 hours of drop-off (vomit risk during play). Stay calm at goodbye — your nerves transfer down the leash. Most evaluations run a half-day so the staff can observe your dog with different groups and play styles.',
      },
      {
        question: 'How often should my dog go to daycare?',
        answer: 'Most dogs do best at 2 to 3 days per week. Five days a week often leads to over-arousal: dogs become wired, restless at home, hard to settle in the evening, and develop demand-barking or reactivity on walks. If your dog is exhausted but still amped at pickup, they need fewer days, not more. Some dogs do great daily, but most need a balance of stimulation and rest. Watch the home behavior — if they\'re struggling to settle, having more accidents, or seeming "extra" at home, reduce frequency.',
      },
      {
        question: 'What questions should I ask a daycare?',
        answer: 'Ask: what is your dog-to-handler ratio, how do you group dogs (size, energy, age), what is your discipline policy, do dogs get rest periods and when, what happens if my dog doesn\'t pass evaluation day, what is your protocol for fights or injuries, can I see the play area at peak hours not just empty, and what vaccinations do you require. Avoid daycares that won\'t answer specifically or refuse a tour.',
      },
      {
        question: 'What stress signs should I watch for at daycare pickup?',
        answer: 'Healthy: tired but loose body, soft eyes, happy tail, drinks water and settles quickly at home. Concerning: bouncy and over-excited (still wired = day was too stimulating), hiding, tail tucked, hard eyes, won\'t make eye contact with handlers. Red flags: limping, raw paw pads, new scrapes, hoarse bark, drooling, refusing to go back inside the daycare next visit. If you see red flags more than once or twice, switch facilities. Trust your dog over the brochure.',
      },
      {
        question: 'Is my dog a good fit for daycare?',
        answer: 'Good fit: dogs who love other dogs, recover quickly from minor scuffles, are well-socialized, and have moderate to high energy that benefits from group play. Not a good fit: dog-reactive or dog-aggressive dogs, very anxious or fearful dogs, senior dogs with mobility issues, dogs who guard resources (toys, food, people), unaltered males or females in heat. Some dogs love daycare; others find it stressful even with the right group. If your dog is showing stress, doesn\'t want to go in, or is exhausted-yet-amped at pickup, daycare may not be the right outlet — try a one-on-one dog walker or trainer-led group instead.',
      },
    ],
    relatedQueries: [
      'Dog daycare near me',
      'Half day dog daycare',
      'Puppy daycare',
      'Dog daycare with webcams',
      'Senior dog daycare',
      'Dog daycare and training',
    ],
  },

  trainers: {
    category: 'trainers',
    guideHeading: 'What to expect from a pet trainer',
    guide: 'Pet trainers help with obedience, behavior modification, puppy socialization, and specialized work like service dog training. Modern professional trainers use positive reinforcement (food, play, praise) as primary methods — backed by decades of research showing it produces faster and more durable results than punishment-based approaches. Look for certifications: CPDT-KA (Certified Professional Dog Trainer), KPA (Karen Pryor Academy), IAABC (International Association of Animal Behavior Consultants), or FFCP (Fear Free Certified Professional). Group classes run $150 to $400 for a 6-week course. Private sessions $75 to $200 per hour. Board-and-train programs $1,500 to $5,000 for 2 to 4 weeks. Avoid trainers who use the words "alpha," "dominance," "pack leader," or who recommend prong, e-collar, or choke chains in the first 30 days. These are red flags for outdated, often harmful methods.',
    faqs: [
      {
        question: 'How much does dog training cost?',
        answer: 'Group classes (6 weeks, 1 hour weekly): $150 to $400. Private in-home sessions: $75 to $200 per hour. Day-train programs (drop off your dog for daily training): $50 to $125 per session. Board-and-train (your dog stays with the trainer for 2 to 4 weeks): $1,500 to $5,000. Behavior consultants for serious issues (aggression, severe anxiety): $200 to $400 per session, often working over 6 to 12 sessions. Cost varies significantly by region and trainer credentials. Higher-priced doesn\'t always mean better — check certifications, methods, and references.',
      },
      {
        question: 'When should I start training my puppy?',
        answer: 'The day you bring them home — usually around 8 weeks. Puppies have a critical socialization window from 3 to 14 weeks, where they form lifelong impressions of what\'s "normal." Don\'t wait until they\'ve completed all vaccinations to expose them to the world. Carry them, use a stroller, or sit on a porch where they can observe new sights, sounds, and people safely. Puppy classes from a positive-reinforcement trainer typically start at 8 to 10 weeks and are crucial for healthy social development. Basic obedience like name, sit, and recall can start the first week.',
      },
      {
        question: 'How do I find a good dog trainer?',
        answer: 'Look for certifications: CPDT-KA, KPA-CTP, IAABC, or FFCP. These require ongoing education and adherence to humane training standards. Ask the trainer to describe their approach — they should mention positive reinforcement, food rewards, and understanding why a dog is doing a behavior. Avoid anyone who uses "alpha," "dominance," "pack leader," or recommends prong/e-collar/choke chain in early training. Ask to observe a class before signing up. Watch how dogs respond — happy, engaged, tails up is good; shut-down, avoidant, or stressed is bad. Read recent reviews focused on results.',
      },
      {
        question: 'What\'s the difference between training methods?',
        answer: 'Positive reinforcement (R+): rewarding desired behavior with food, play, or praise. Builds confidence, works fast, durable results. Modern professional standard. Force-free or LIMA (Least Intrusive Minimally Aversive): same as R+ but explicitly rules out aversive tools. Balanced training: uses both rewards AND aversive tools (prong, e-collar). Controversial — research shows aversive tools increase fear and aggression in many dogs. Dominance/alpha methods: based on debunked wolf-pack theory. Modern science has largely abandoned these methods. For most pet dogs, choose a certified positive reinforcement or force-free trainer.',
      },
      {
        question: 'Why is my dog suddenly behaving differently?',
        answer: 'Sudden behavior changes often signal medical issues — pain, vision/hearing changes, cognitive decline in seniors, thyroid issues, or neurological problems. See your vet before assuming it\'s purely behavioral. Other common triggers: changes in routine (new job hours, family member moving in/out), changes in environment (new house, construction noise), trauma at daycare or boarding, fear period in adolescents (typically 6 to 14 months), or accumulated stress that\'s reaching a threshold. A certified behavior consultant can help differentiate medical from behavioral causes and develop a plan.',
      },
      {
        question: 'Can old dogs really learn new tricks?',
        answer: 'Yes — research shows older dogs can learn at any age, often more reliably than puppies because they have longer attention spans. The myth comes from people noticing senior dogs sometimes learn slower, but slower-and-steadier often means deeper retention. Keep sessions short (5 to 10 minutes), use high-value rewards, and accommodate any physical limitations (joint issues, hearing loss, vision changes). Mental stimulation is great enrichment for senior dogs. Trick training, scent work, and puzzle feeders are wonderful for older dogs.',
      },
    ],
    relatedQueries: [
      'Puppy training near me',
      'Reactive dog trainers',
      'Aggressive dog trainers',
      'Service dog training',
      'Board and train programs',
      'Force free dog trainers',
    ],
  },

  pet_pharmacies: {
    category: 'pet_pharmacies',
    guideHeading: 'What to expect from a pet pharmacy',
    guide: 'Pet pharmacies fill prescriptions written by your veterinarian for your pet. They include in-clinic dispensaries, dedicated veterinary pharmacies, online pet pharmacies (Chewy Pharmacy, 1-800-PetMeds), and major human pharmacies (Costco, Walmart, Sam\'s Club) that fill many veterinary prescriptions at significantly lower prices. Always ask for the generic version — generic pet medications are typically 60 to 80 percent cheaper than brand names with identical efficacy. Many veterinary drugs are the same molecule as human drugs, so a human pharmacy can fill them at human-pharmacy prices. Your vet can call or fax the prescription to any licensed pharmacy. Compounded medications (custom-mixed for hard-to-medicate pets) take longer to fill — order 2 weeks ahead. Never give human medications without explicit veterinary approval, even ones that seem safe.',
    faqs: [
      {
        question: 'How can I save money on pet medications?',
        answer: 'Ask your vet "is there a generic equivalent?" — generics typically save 60 to 80 percent. Ask if a human pharmacy can fill the prescription (Costco, Walmart, Sam\'s Club often beat clinic prices significantly). Compare GoodRx prices for the human-pharmacy equivalent. For long-term medications, request a 90-day supply instead of 30 — usually a discount. Online pet pharmacies (Chewy Pharmacy, 1-800-PetMeds) often beat clinic prices, especially for flea/tick and heartworm. Pet insurance prescription coverage can offset costs for chronic conditions. Always shop around — clinic dispensary prices are often the highest option.',
      },
      {
        question: 'Are online pet pharmacies safe?',
        answer: 'Legitimate online pet pharmacies are safe and usually cheaper than clinic dispensaries. Look for VIPPS accreditation (Verified Internet Pharmacy Practice Sites) or Vet-VIPPS for veterinary-specific pharmacies — these are licensed, regulated, and require valid prescriptions. Major reputable options: Chewy Pharmacy, 1-800-PetMeds, Walmart Pet Rx, Costco Pet Pharmacy. Avoid sites that don\'t require a vet prescription (illegal and often counterfeit), foreign pharmacies that ship without verification, or sites with prices significantly below market — counterfeit pet medications are a real problem.',
      },
      {
        question: 'Can my pet take human medications?',
        answer: 'Some human medications are safe for pets in correct doses prescribed by a vet — others are deadly. Never give without explicit vet approval. Deadly: ibuprofen (Advil), acetaminophen (Tylenol — fatal to cats), naproxen (Aleve), ADHD meds (Adderall, Ritalin), antidepressants (Prozac in human doses), pseudoephedrine (Sudafed), Vitamin D supplements, sleep aids. Sometimes prescribed by vets at species-specific doses: Benadryl, Pepcid, Imodium, certain antibiotics. The dose is critical — pet doses are based on weight and species, not human equivalents.',
      },
      {
        question: 'How should I store pet medications?',
        answer: 'Keep medications in their original container with the label intact. Store in a cool, dry, dark place — NOT the bathroom (humidity ruins potency). Insulin and most liquid medications need refrigeration but should never be frozen. Never store pet meds with human meds — labels look similar and accidental cross-medication is common. Check expiration dates regularly — expired medications can become ineffective or even toxic. Dispose of unused medications at a pharmacy take-back program, not in the trash or toilet (environmental contamination).',
      },
      {
        question: 'When should I refill my pet\'s prescription?',
        answer: 'Daily medications (heart, thyroid, diabetes): order when you have 14 days remaining to allow for shipping or refill processing. Pain medications and antibiotics: get the refill at the same visit as the recheck appointment so you don\'t run out. Heartworm and flea/tick prevention: set a phone reminder one month before the annual supply ends. Insulin: keep one extra vial on hand at all times — pharmacies sometimes back-order. Compounded medications: order 2 weeks early — they take longer to mix.',
      },
      {
        question: 'What should I do if my pet has a bad reaction to a medication?',
        answer: 'For severe reactions (difficulty breathing, swelling of face/throat, collapse, seizures, severe vomiting), go to the emergency vet immediately — these can be fatal within minutes. For mild reactions (lethargy, mild GI upset, decreased appetite within 48 hours of starting a new med), call your vet and the prescribing pharmacy — they may adjust the dose, switch medications, or recommend monitoring. For accidental double dose or a pet getting into the medication container, call ASPCA Animal Poison Control at (888) 426-4435 ($95 fee) or the Pet Poison Helpline at (855) 764-7661. Save the medication packaging — they\'ll need exact ingredients and concentration.',
      },
    ],
    relatedQueries: [
      'Cheap pet medications',
      'Pet pharmacy near me',
      'Compound pet pharmacy',
      'Pet medication delivery',
      'Generic pet drugs',
      'Pet insurance prescription coverage',
    ],
  },
}

export function getCategoryContent(category: string | null | undefined): CategoryContent | null {
  if (!category) return null
  return CATEGORY_CONTENT[category] ?? null
}
