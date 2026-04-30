/**
 * Lead-magnet content map.
 * One magnet per provider category. Each is a useful, branded
 * checklist that gets delivered to the user's email after signup
 * and bridges to PetOS Health at the bottom.
 *
 * Used by:
 *   - <CategoryLeadMagnet /> (renders the on-page card)
 *   - api/lead-magnet.ts (renders the email body)
 */

export interface MagnetSection {
  heading: string
  bullets: string[]
}

export interface Magnet {
  /** Provider category slug — must match CATEGORIES in src/lib/constants.ts */
  category: string
  /** Headline shown on the page card */
  title: string
  /** 1-line value prop under the title */
  subtitle: string
  /** Button label */
  ctaCopy: string
  /** 3 bullet benefits on the on-page card */
  benefits: string[]
  /** Subject line of the delivered email */
  emailSubject: string
  /** Big headline at the top of the email */
  emailHeadline: string
  /** 1-paragraph intro under the headline */
  emailIntro: string
  /** Main body of the email — sections of bulleted checklists */
  sections: MagnetSection[]
}

export const MAGNETS: Record<string, Magnet> = {
  veterinarians: {
    category: 'veterinarians',
    title: 'Free Vet Visit Prep Sheet',
    subtitle: 'Walk into your appointment with everything the vet needs — and never forget a question again.',
    ctaCopy: 'Email me the prep sheet',
    benefits: [
      'Symptom checklist so you can describe issues clearly',
      '12 questions to ask before any test or treatment',
      'Records to bring + what your vet wishes you knew',
    ],
    emailSubject: '🐾 Your Vet Visit Prep Sheet (bring this to the appointment)',
    emailHeadline: 'Your Vet Visit Prep Sheet',
    emailIntro: "Vet visits go better when you walk in prepared. Use this checklist to make sure nothing important gets skipped — print it, screenshot it, or open it on your phone at the front desk.",
    sections: [
      {
        heading: 'Bring these records',
        bullets: [
          'Vaccination history (or photo of last vet receipt)',
          'List of current medications, supplements, and dosages',
          'Recent food brand + how much per day',
          'Notes from any specialist visits in the last year',
          'A stool sample if your vet asks for one (within 4 hours, sealed)',
        ],
      },
      {
        heading: 'Symptom checklist — circle anything from the past 2 weeks',
        bullets: [
          'Eating less / more than usual',
          'Drinking less / more water',
          'Vomiting (how often? what color?)',
          'Diarrhea or constipation',
          'Limping or trouble standing',
          'Coughing, sneezing, or labored breathing',
          'Excessive licking, scratching, or head shaking',
          'Behavior changes (hiding, lethargy, aggression)',
          'Weight loss or gain',
          'Lumps, rashes, or skin discoloration',
        ],
      },
      {
        heading: '12 questions to ask BEFORE tests or treatment',
        bullets: [
          '"What are you looking for with this test?"',
          '"What\'s the cost — and what changes if it comes back positive?"',
          '"Is there a less expensive test that gives the same answer?"',
          '"Do you offer payment plans or accept CareCredit?"',
          '"What is the generic version of this medication?"',
          '"What side effects should I watch for in the first 48 hours?"',
          '"How will we know this treatment is working?"',
          '"When should I call you back vs come back in?"',
          '"What can I do at home to help recovery?"',
          '"Do you recommend pet insurance for a pet at this age?"',
          '"Is this condition something we screen for going forward?"',
          '"Can I get a written summary of today\'s visit?"',
        ],
      },
      {
        heading: 'After the visit — write down within 1 hour',
        bullets: [
          'Diagnosis (or "we ruled out X")',
          'Medications prescribed (name, dose, frequency, duration)',
          'Recheck or follow-up date',
          'Any test results that are pending',
          'Total cost — for your records and pet insurance',
        ],
      },
    ],
  },

  emergency_vets: {
    category: 'emergency_vets',
    title: 'Free Pet Emergency First-Aid Card',
    subtitle: 'What to do in the 15 minutes BEFORE you reach the emergency vet — could save your pet\'s life.',
    ctaCopy: 'Email me the emergency card',
    benefits: [
      'Pet CPR steps + how to safely transport an injured pet',
      'Common household toxins (act fast checklist)',
      'What to bring + what to tell the vet on the phone',
    ],
    emailSubject: '🚨 Your Pet Emergency First-Aid Card (save this email)',
    emailHeadline: 'Pet Emergency First-Aid Card',
    emailIntro: 'In an emergency, the right action in the first 15 minutes matters more than how fast you drive. Save this email — and add the emergency vet\'s number to your phone right now.',
    sections: [
      {
        heading: 'Call the emergency vet ON THE WAY — tell them',
        bullets: [
          'Pet species, breed, age, and approximate weight',
          'What happened, when, and what you\'ve done so far',
          'If they ate something: what, how much, how long ago',
          'Current symptoms (vomiting, breathing, consciousness)',
          'Your ETA — they may prep equipment before you arrive',
        ],
      },
      {
        heading: 'Common household toxins — act IMMEDIATELY if ingested',
        bullets: [
          'Chocolate (dark > milk > white) — call vet, do NOT wait for symptoms',
          'Xylitol (sugar-free gum, peanut butter, baking) — life-threatening',
          'Grapes, raisins, currants — even small amounts can cause kidney failure',
          'Onions, garlic, leeks (raw, cooked, powder) — destroys red blood cells',
          'Lily plants (cats) — touch a leaf = kidney emergency',
          'Human meds: ibuprofen, acetaminophen, ADHD pills, antidepressants',
          'Antifreeze (sweet taste, drawn to it) — call IMMEDIATELY',
          'Rat poison or snail bait',
        ],
      },
      {
        heading: 'Pet CPR (only if not breathing AND no pulse)',
        bullets: [
          '1. Lay pet on right side, on a firm flat surface',
          '2. For dogs >30lb: hands stacked over widest part of chest',
          '3. For dogs <30lb / cats: one hand around chest, thumb on one side, fingers on the other',
          '4. Compress 1/3 to 1/2 chest depth, 100–120 per minute (to the beat of "Stayin\' Alive")',
          '5. Every 30 compressions: close mouth, breathe into nose for 1 second, watch chest rise',
          '6. Continue until pet breathes on their own or you reach the vet',
        ],
      },
      {
        heading: 'How to safely transport an injured pet',
        bullets: [
          'Use a flat board, sturdy box, or laundry basket — keep their spine straight',
          'Approach slowly. Pain causes biting even from gentle pets',
          'Cover with a towel or blanket (warmth + reduces panic)',
          'Apply pressure to bleeding wounds with a clean cloth — do NOT remove if soaked through',
          'For broken bones: do NOT try to splint — just immobilize and go',
          'Drive calmly. A second accident helps no one',
        ],
      },
      {
        heading: 'Bring with you (grab in 30 seconds)',
        bullets: [
          'Vaccination records (photo on phone is fine)',
          'Current medications (or just the bottles)',
          'Sample of vomit, stool, or anything they ate (in a sealed bag)',
          'Their normal collar/leash + a towel',
          'A credit card — emergency vets typically require deposit upfront',
        ],
      },
    ],
  },

  groomers: {
    category: 'groomers',
    title: 'Free Breed-Specific Grooming Calendar',
    subtitle: 'How often your pet really needs grooming, what to ask for, and how to spot a great groomer from a bad one.',
    ctaCopy: 'Email me the grooming calendar',
    benefits: [
      'Cadence by coat type (you\'re probably overdue or overdoing it)',
      'Exact phrases to use when asking for the cut',
      '5 red flags that mean "find a different groomer"',
    ],
    emailSubject: '✂️ Your Pet Grooming Calendar + What to Ask For',
    emailHeadline: 'Your Pet Grooming Calendar',
    emailIntro: 'Most pet owners under-groom or over-groom — and almost none know exactly what to ask for. Here\'s the cadence by coat type, the exact phrases to use, and how to tell a great groomer from a bad one.',
    sections: [
      {
        heading: 'How often should they go? (full groom, not just a bath)',
        bullets: [
          'Double-coated breeds (Husky, Golden, Aussie): every 8–12 weeks. Brush WEEKLY at home.',
          'Curly / non-shedding (Doodles, Poodles, Bichons): every 4–6 weeks. Mat-prone if you skip.',
          'Long single-coat (Yorkie, Maltese, Shih Tzu): every 4–6 weeks',
          'Short single-coat (Lab, Beagle, Boxer): every 8–12 weeks for nail/ear cleaning + bath',
          'Wire-coat (Schnauzer, Terriers): every 6–8 weeks — ask for hand-stripping if breed-correct',
          'Cats: long-haired every 4–8 weeks, short-haired every 3–6 months',
        ],
      },
      {
        heading: 'How to ask for the cut you actually want',
        bullets: [
          '"Show me a photo on your phone" — bring 2–3 reference photos always',
          'For doodles: "Teddy bear face, 1 inch all over body, scissor finish" (not shaved)',
          'For double-coats: "Brush out, deshed, bath, blowout. DO NOT shave the coat — it doesn\'t grow back the same."',
          'For matted dogs: "Shave-down today, then we maintain at [4/6/8] weeks"',
          'For nervous pets: "Please call me before any sedation or muzzling"',
          'Sanitary trim, paw pads, and ears: ask explicitly — many groomers skip if you don\'t',
        ],
      },
      {
        heading: '5 red flags — find a different groomer',
        bullets: [
          'They won\'t let you see the back/grooming area',
          'They refuse to give a time estimate ("we\'ll call when ready" with no window)',
          'They suggest shaving a double-coat for "summer comfort" (this is wrong)',
          'They use force, scruff, or muzzle without telling you first',
          'Your pet comes home with razor burn, nicks, or a noticeably different demeanor',
        ],
      },
      {
        heading: 'Between groomings (do this weekly)',
        bullets: [
          'Brush in the direction of the coat — get all the way to the skin',
          'Check ears for redness, smell, or wax buildup',
          'Run hands along the body feeling for mats, lumps, or sore spots',
          'Trim nails or use a grinder — if you hear them clicking on the floor, they\'re too long',
          'Brush teeth (or at minimum, dental chew daily)',
        ],
      },
    ],
  },

  boarding: {
    category: 'boarding',
    title: 'Free Pet Boarding Drop-Off Checklist',
    subtitle: 'Pack right, ask the right questions, and spot a sketchy boarder before you leave your pet behind.',
    ctaCopy: 'Email me the boarding checklist',
    benefits: [
      'Pack list so nothing critical gets forgotten',
      '8 questions to ask BEFORE booking',
      'How to spot stress signs at pickup (and what to do)',
    ],
    emailSubject: '🏠 Your Pet Boarding Drop-Off Checklist',
    emailHeadline: 'Your Pet Boarding Drop-Off Checklist',
    emailIntro: 'Boarding is one of the most stressful pet decisions because you can\'t see what happens when you leave. Use this checklist to vet the boarder, pack right, and read your pet at pickup.',
    sections: [
      {
        heading: 'Ask BEFORE booking',
        bullets: [
          '"What\'s the staff-to-pet ratio overnight?"',
          '"How many potty/exercise breaks per day, and for how long?"',
          '"How are dogs grouped — by size, energy, temperament?"',
          '"What\'s your protocol if my pet stops eating or shows stress?"',
          '"Which emergency vet do you use, and have you used them before?"',
          '"Can I see the sleeping area and play area on a tour?"',
          '"What vaccinations do you require? How recent?"',
          '"What\'s your refund / early-pickup policy?"',
        ],
      },
      {
        heading: 'Pack list (label everything with your pet\'s name)',
        bullets: [
          'Their normal food (enough for stay + 2 extra days, in original bag or photo of label)',
          'Current medications — pre-portioned in a labeled pill organizer',
          'A worn t-shirt or blanket from home (smells like you = comfort)',
          'One familiar toy (not a brand-new one)',
          'Collar with current ID tag + a backup leash',
          'Vaccination records (printed or emailed in advance)',
          'Written feeding schedule and any quirks ("eats slowly", "hates the high-pitched whistle")',
          'Two emergency contacts — yours + a backup who CAN authorize vet care',
        ],
      },
      {
        heading: 'Stress signs at pickup — watch for these in the first 48hrs',
        bullets: [
          'Excessive thirst or urination',
          'Loose stool, vomiting, or refusing food',
          'Limping, raw paw pads, or new scrapes',
          'Hoarse bark (sign of excessive barking)',
          'Coughing within 5–10 days (kennel cough — vaccinate next time)',
          'Unusual lethargy OR hyperactivity',
          'Fearfulness or aggression that wasn\'t there before',
        ],
      },
      {
        heading: 'When you get home',
        bullets: [
          'Offer water, then a small meal (not a full one — they may bolt-eat)',
          'Let them settle. No big greetings, no overstimulation',
          'Inspect them: paws, ears, tail, between toes, under collar',
          'Watch them pee — color and effort',
          'If anything feels off, call your vet within 24 hours',
        ],
      },
    ],
  },

  daycare: {
    category: 'daycare',
    title: 'Free Doggy Daycare Drop-Off Checklist',
    subtitle: 'Make daycare a habit your dog loves — without the stress signs that mean it\'s the wrong fit.',
    ctaCopy: 'Email me the daycare checklist',
    benefits: [
      'Eval-day prep so they pass the temperament test',
      'How often is too often (the answer surprises people)',
      'Pickup signs that mean "this place isn\'t working"',
    ],
    emailSubject: '🐕 Your Doggy Daycare Checklist (eval day + every visit)',
    emailHeadline: 'Your Doggy Daycare Checklist',
    emailIntro: 'Daycare can transform a high-energy dog\'s life — or wreck it if the fit is wrong. Use this to nail the eval day, pack right, and read your dog\'s body language at pickup.',
    sections: [
      {
        heading: 'Eval day — set them up to pass',
        bullets: [
          'Exercise them lightly that morning (walk, not zoomies — they need to be receptive, not exhausted)',
          'Bring vaccination records: rabies, DHPP, Bordetella, often canine flu',
          'Spay/neuter usually required for dogs over 6–7 months',
          'Bring a flat collar with ID — no prong, choke, or e-collars',
          'Don\'t feed within 2 hours of drop-off (vomit risk during play)',
          'Stay calm at goodbye — your nerves transfer down the leash',
        ],
      },
      {
        heading: 'Ask the daycare these questions',
        bullets: [
          '"What\'s your dog-to-handler ratio?"',
          '"How are dogs grouped — size, energy, age?"',
          '"What\'s your time-out / discipline policy?"',
          '"Do dogs get rest periods? When?"',
          '"What happens if my dog doesn\'t pass eval day?"',
          '"What\'s the protocol for fights or injuries?"',
          '"Can I see the play area at peak hours, not just empty?"',
        ],
      },
      {
        heading: 'How often is too often?',
        bullets: [
          'Most dogs: 2–3 days a week is the sweet spot',
          '5 days a week often leads to over-arousal — restless at home, hard to settle, bratty behavior',
          'Watch for: refusing to settle in the evening, increased reactivity on walks, demand-barking — these are over-stimulation signs',
          'If your dog is exhausted but still amped at pickup, they need fewer days, not more',
        ],
      },
      {
        heading: 'Pickup body-language check',
        bullets: [
          'GOOD: tired but loose, soft eyes, happy tail, drinks water then settles',
          'NEUTRAL: bouncy and over-excited (still wired = day was too stimulating)',
          'CONCERNING: hiding, tail tucked, hard eyes, won\'t make eye contact with handlers',
          'RED FLAGS: limping, raw pads, new scrapes, hoarse bark, drooling',
          'If you see red flags 2+ visits in a row, switch facilities. Trust your dog over the brochure',
        ],
      },
    ],
  },

  trainers: {
    category: 'trainers',
    title: 'Free First 30 Days Training Plan',
    subtitle: 'A daily 5-minute plan that builds the foundation — and the 3 trainer red flags that will undo all your work.',
    ctaCopy: 'Email me the 30-day plan',
    benefits: [
      'Week-by-week milestones (sit, name, recall, leash, settle)',
      'What modern trainers do — and the old-school methods to avoid',
      'How to tell if your trainer is making your dog worse',
    ],
    emailSubject: '🎓 Your First 30 Days Training Plan',
    emailHeadline: 'First 30 Days Training Plan',
    emailIntro: 'You don\'t need an hour a day. You need 5 focused minutes, daily, with the right priorities. Here\'s the plan — and the trainer red flags you\'ll wish you knew about earlier.',
    sections: [
      {
        heading: 'Week 1 — name + engagement',
        bullets: [
          'Goal: dog turns to you when you say their name, every time',
          'Drill: 10 reps, 3x/day. Say name → they look at you → mark with "yes" → treat',
          'Add hand-feeding meals for the first week (every meal = training opportunity)',
          'NO commands you can\'t reward yet. Just engagement',
          'House rules established: where they sleep, what furniture, what doors',
        ],
      },
      {
        heading: 'Week 2 — sit, settle, crate (if using)',
        bullets: [
          'Sit: lure with treat over their head, hips drop, mark + treat. 10 reps morning + night',
          'Settle: reward stillness on a mat. Start with 5 seconds, build to 5 minutes',
          'Crate: feed every meal in the crate, door open. By end of week, close door for 30 sec → 5 min',
          'Continue Week 1 drills (name still daily)',
        ],
      },
      {
        heading: 'Week 3 — recall + leash basics',
        bullets: [
          'Recall: indoors only this week. Two people, take turns calling, JACKPOT treats',
          'Never call your dog for something they don\'t want (bath, nail trim, ending fun)',
          'Leash: stand still when they pull. Move when leash is loose. Boring = effective',
          'Add one new environment per week (front yard → quiet sidewalk → busier area)',
        ],
      },
      {
        heading: 'Week 4 — settle in distractions + leave-it',
        bullets: [
          'Practice "settle" with the doorbell, with food being prepped, with kids playing',
          'Leave-it: cover treat with hand, wait for them to back off, mark + reward from OTHER hand',
          'Generalize sit/recall to new locations — backyard, friend\'s house, parking lot',
          'Reward generously — they\'re learning the WORLD is the classroom now',
        ],
      },
      {
        heading: 'Trainer red flags — leave the session, demand a refund',
        bullets: [
          'Uses "alpha", "dominance", "be the pack leader" language',
          'Recommends prong, e-collar, or choke chain in the first 30 days',
          'Pins, alpha-rolls, or yells at the dog',
          'Won\'t let you observe a class before signing up',
          'No certifications (look for: CPDT-KA, KPA, IAABC, FFCP)',
          'Guarantees behavior outcomes (no ethical trainer does)',
        ],
      },
      {
        heading: 'What good trainers actually do',
        bullets: [
          'Use food, play, and praise as primary reinforcement',
          'Set criteria small and build success quickly',
          'Teach YOU as much as the dog (you\'re with them 23.5 hours a day)',
          'Adjust based on your dog\'s temperament, not a script',
          'Welcome questions and explain the "why" behind each exercise',
        ],
      },
    ],
  },

  pet_pharmacies: {
    category: 'pet_pharmacies',
    title: 'Free Pet Med Safety Checklist',
    subtitle: 'Save money on pet meds, store them safely, and avoid the human medications that can kill your pet.',
    ctaCopy: 'Email me the med safety checklist',
    benefits: [
      'Human meds that are deadly (and what they\'re commonly mistaken for)',
      'How to ask for generic alternatives (often 60–80% cheaper)',
      'Refill timing + storage tips that extend potency',
    ],
    emailSubject: '💊 Your Pet Med Safety Checklist',
    emailHeadline: 'Pet Med Safety Checklist',
    emailIntro: 'Pet medications are expensive, often confusing, and frequently dangerous when mixed with the wrong human meds. Here\'s how to save money, store them right, and avoid the most common life-threatening mistakes.',
    sections: [
      {
        heading: 'Human meds that can kill pets — NEVER give without explicit vet approval',
        bullets: [
          'Ibuprofen (Advil, Motrin) — even one pill can cause kidney failure',
          'Acetaminophen (Tylenol) — fatal to cats, dangerous to dogs',
          'Naproxen (Aleve) — extremely toxic',
          'ADHD meds (Adderall, Ritalin) — small dose = emergency',
          'Antidepressants (Prozac, Effexor, Zoloft) — seizure risk',
          'Sleep aids (Ambien, melatonin in high doses) — paradoxical agitation',
          'Pseudoephedrine (Sudafed) — heart and CNS toxicity',
          'Vitamin D supplements — kidney damage at small doses',
        ],
      },
      {
        heading: 'How to save money on pet meds',
        bullets: [
          '"Is there a generic equivalent of this medication?" — often 60–80% off',
          'Ask if a human pharmacy can fill it (Costco, Walmart, Sam\'s Club often cheaper for certain drugs)',
          'For long-term meds: ask for a 90-day supply instead of 30 — usually a discount',
          'Compare GoodRx prices for the equivalent human-pharmacy version',
          'Online pet pharmacies (Chewy Pharmacy, 1-800-PetMeds) often beat clinic prices — your vet can call/fax the Rx',
          'Pet insurance + prescription reimbursement: read the fine print on chronic-condition coverage',
        ],
      },
      {
        heading: 'Storage — most owners get this wrong',
        bullets: [
          'Keep in original container with the label intact',
          'Cool, dry, dark — NOT the bathroom (humidity ruins potency)',
          'Insulin and most liquid meds: refrigerate, do NOT freeze',
          'Never store pet meds with human meds — labels look similar, mix-ups happen',
          'Check expiration dates — expired meds can become ineffective OR toxic',
          'Dispose of unused meds at a pharmacy take-back program, not the trash or toilet',
        ],
      },
      {
        heading: 'Refill timing — order at these triggers',
        bullets: [
          'Daily meds (heart, thyroid, etc): reorder when you have 14 days left',
          'Pain meds / antibiotics: get refill same day as the recheck visit',
          'Heartworm + flea/tick: set a phone reminder 1 month before annual supply runs out',
          'Insulin: order 1 vial ahead at all times — pharmacies sometimes back-order',
          'Compounded meds (custom-mixed): order 2 weeks early, they take longer',
        ],
      },
      {
        heading: 'Red flags — call the pharmacist (or vet) immediately',
        bullets: [
          'Pill looks different size, color, or shape than the last refill',
          'Pet vomits within 2 hours of taking the med',
          'New lethargy, loss of appetite, or behavior change starting after a new med',
          'Any rash, swelling, or trouble breathing → emergency vet, NOT pharmacy',
          'Accidental double dose — call ASPCA Poison Control (888-426-4435, $95 fee)',
        ],
      },
    ],
  },
}

/**
 * Get the right magnet for a provider category. Falls back to the
 * vet magnet if we don't have a specific one for the category — vets
 * are the largest cohort and the prep-sheet content is broadly useful.
 */
export function getMagnetForCategory(category: string | null | undefined): Magnet {
  if (!category) return MAGNETS.veterinarians
  return MAGNETS[category] ?? MAGNETS.veterinarians
}
