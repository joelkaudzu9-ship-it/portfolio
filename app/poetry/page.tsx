'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, Quote, BookOpen, Heart, Infinity, 
  TrendingUp, Eye, Calendar, Star, ChevronRight,
  X, Sparkles
} from 'lucide-react'

const poems = [
  {
    id: 1,
    title: 'PARADOXICAL',
    section: 'BROKEN AND BECOMING',
    excerpt: 'Too much of a good thing they say, Can be harmful in some way...',
    fullPoem: `Too much of a good thing  they say,
Can be harmful in some way,
Of course  it  seems to pave way
But when does it become too much?
How do we know when to stop and clutch?
It's easy to be swept up in excess,
To be poisoned by success
To lose sight of what really makes us blessed.
The more we have, the less we see
 
But why?
The harder we try the more we cry
We've tried so hard with all our might
But somehow things never turn out right
The harder we push the more we fail
Our efforts seem to be in vain and pale
Like secondary school porridge bitter and stale
 
But maybe there's a lesson to be learned
That sometimes when you try too hard, you'll burn
Perhaps it's best to take a step back
Some achievements are way beyond luck
To change the world they say you must Accept the way it is
And trust that what you resist, Persists with force
But what you embrace can bring remorse.
To make things different first accept them as they are
Then change will come from near or far
Don't fight against the things you hate
But rather learn from them to appreciate`,
    date: '2024'
  },
  {
    id: 2,
    title: 'MY PAST I\'M SORRY',
    section: 'BROKEN AND BECOMING',
    excerpt: 'First Let me say sorry I failed you, Like a plane those promises just flew...',
    fullPoem: `First Let me say sorry I failed you
Like a plane those promises just flew
bad i could not achieve even a few
I said I will make you rememberable
But I can not dare reminisce about you
All my words dearly were true
But some obstacles in life are just too true

My past im sorry 
Sorry for being a bad Steward
I vowed to tame you well
It's pretty clear on that I fell
The little hope I gave you,all shattered
Those efforts I gathered,all scattered
The path I chose was a mistake
Please forgive me for Gods sake
 
I'm blank of what went wrong
I thought I had set everything straight
All being alright seemed fate
It was late when I realised,
My choice was my bad mate
Sorry I failed you
 
All that aside
Allow me to make a mends
I know I can't undo the already done
But I can create new memories,ask me how?
I'm looking at your brother,MY FUTURE
I think he might be a second chance
For now I have my balance
Learnt it the hard way
It is the time to do it God's way
I take an oath my past
 
I swear I'll make your brother,my future,the best thing that has ever happened to me
This time my success is inevitable
For I have my all clinging to this oath
Just like soot to a clay pot
A shoe and a lace
I will win this race
Against all odds I shall prevail
Surely I am not going to fail
I have my eyes sharpened
Things happened
But it's time to let go
Again,my past I'm sorry`,
    date: '2024'
  },
  {
    id: 3,
    title: 'LOST GOLD',
    section: 'BROKEN AND BECOMING',
    excerpt: 'Hey friend, I know we\'re not in good terms, Our bond like dying flames...',
    fullPoem: `Hey friend,
I know we're not in good terms
Our bond like dying flames
But you're still my good friend
True we drifted apart
Mine for you is still a heavy heart
 
We've come way from far
Walked on dusty roads and tar
You were always my companion
And I never lost compassion
 
Our friendship did not cease
Selfish, I let it freeze
I know it's hard we go back
It's just your presence that I lack
 
Take your time and think about it
I thought of the good old days a bit
Yes I realised
Your face from my life,I failed to erase
 
Your memories keep receding
The gaps I fail to keep feeding
I Hope we are not beyond repair
I don't think this emptiness I can bare
 
You know several times I pleaded
But it's seemed the elastic limit was already exceeded
Now we are not even common
Maybe just the skin tone
But our architectures changed
like spades and jacks
No turning back?

I'd still give it another go
In fact,all the go's in the world
Wherever you are,feel longed for
Sincerely,the boy with the eyes four`,
    date: '2024'
  },
  {
    id: 4,
    title: 'SO I\'M HERE',
    section: 'BROKEN AND BECOMING',
    excerpt: 'I look up I look down, Faces staring, it\'s like I should drown...',
    fullPoem: `I look up I look down
Faces staring, it's like I should drown
I turn left and turn right
Happy faces, and there's me in fright
So I'm here

A 20 Hour drive ends here
To A destination frosted in fear
Hopes shattered,reality builds
Sought confidence, self slavery yielded
 
A place in dreams so envisioned
Sadly ,to the dungeon I was commissioned
Pain,pain,pain
Let it rain rain rain
So I'm here
Is this what it's become
I thought the journey to life began
Time stopped a while ago
Infinitely stuck in a smoked Canva
Was it life? No. I see myself a cadaver`,
    date: '2024'
  },
  {
    id: 5,
    title: 'The Boy Who Almost Gave Up',
    section: 'BROKEN AND BECOMING',
    excerpt: 'There was a boy who used to laugh with his whole chest...',
    fullPoem: `There was a boy who used to laugh with his whole chest.
He believed in God. He believed in family.
He believed he was made for something more.
But life hit him.
First, it showed up in his skin — a rash, small and annoying.
Then it came in disappointment — results that didn't match his prayers.
Then silence — people stopped checking in.
Then doubt — "Am I really who I thought I was?"
 
And slowly, piece by piece, he started disappearing inside.
He was still smiling. Still showing up. Still quoting verses.
But in private?
He felt weak. Forgotten. Unseen.
 
He didn't hate God
but he wondered if God had stepped back.
He felt like the golden child who lost his shine.
Even his own reflection started to feel like a stranger.
And no one saw.
Not his friends who told him to man up.
Not his parents who didn't know how much he was hurting.
Not even the church that once clapped for his potential.
 
But God saw.
One night, in the middle of one of those "God, I'm tired" moments
He whispered something to himself
"I don't even know who I am anymore"
 
And for the first time in a long time, he didn't feel alone.
No lightning. No angels singing.
Just stillness, peace and a deep voice in his spirit:
"You are not your skin.
You are not your results.
You are not the shame you carry.
You are my son.
And I have not changed my mind about you"
 
He broke. He cried
not because he was weak
but because he was still alive.
And somehow, that was proof that God hadn't left.
 
He didn't bounce back overnight.
But he got up the next morning and he started again.
He wrote down goals.
He deleted things that were stealing his peace.
He stopped shrinking himself to fit in.
He let go of some people.
He kept praying even when it felt dry.
He found God in the silence, not just the fire.
 
He wasn't hiding anymore.
Not from God.
Not from life.
Not from himself.
 
Now, he's becoming a man with vision.
He protects his mind.
He watches what he posts.
He treats his life like a brand — valuable, strategic, intentional.
He doesn't chase swag.
He builds legacy.
 
He prays before he plans.
He worships even when he's confused.
He asks God for wisdom like it's oxygen.
He builds his life on spirit, not on flesh.
 
He still battles urges.
He still gets tempted to give up.
But now he knows — God isn't after perfection
He's after progress.
And progress means showing up, even with shaky hands.
 
He used to think pain disqualified him
But now he knows — pain made him ready
He thought he was lost.
But he was only buried.
And now he's growing.

So if you ever see him smiling, worshiping, or dreaming again
just know — this is the boy who almost gave up
but didn't.
And now, he is becoming the man God always knew he'd be.
Living life not out of decree
Embracing the beauty of living, wild and free
 
Alas, alas
He is heading there
With shoes on or feet rooted bare
Young and strong or grayed hair
Freedom is the goal still`,
    date: '2024'
  },
  {
    id: 6,
    title: 'MY TIME WAS COMING',
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'For the stars to appear it has to be dark...',
    fullPoem: `For the stars to appear it has to be dark
I cry each time I look back
I recall the times I used to wear a sack
For all the necessities I used to lack
That's a time of unspoken bad luck
So sad in that state for long i was stuck
Even my only relative turned his back
My thumbs so dirty I could not even suck
Little did I know
My time was coming
 
Though at that time I lacked smiles
I tried my best to walk uncountable miles
In that journey of life for a long while
For the road was not as smooth as a tile
But rather rough as a file
Indeed I had to fight
My time was coming
 
My betterment was what I fought for
I had to use my long horn
Many Surprised today I've won
Free as an electron
For sure my time was coming
 
Now look at what my labour has brought
It has indeed brought a lot
A future worth calling a fruit
True it wasn't an easy route
The seeds took way long to sprout
But the harvests were worth it 
I just had to believe 
My time was coming`,
    date: '2024'
  },
  {
    id: 7,
    title: 'THE LIGHT IN THE DARK',
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'Through the stormy nights you were his shelter...',
    fullPoem: `Through the stormy nights you were his shelter,
A beacon of hope when his foundation was weak 
Your words gave him courage when he felt like giving up,
He found strength to rise up and his spirit perked up
 
You lifted his head when he was bowed down in despair
Your light shone bright, and gave him hope to repair,
You noticed him when all he felt was disregarded,
Your compassion was medicine for his emotional infection,
And when the emotions became chaotic
your support was catalytic through your reckless love 
 
His heart was heavy, his spirit broken
But you were there to raise him up
He felt cast aside and you saw his value 
Wonderful merciful savior, that is you`,
    date: '2024'
  },
  {
    id: 8,
    title: 'FRACTURED LIGHT',
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'The fear of letdown gives us no reason to try again...',
    fullPoem: `The fear of letdown gives us no reason to try again
The people we trust are the ones who make it rain
The level of constant disappointments burdens us
Leaving us fed up, exhausted, and deeply burnt

The last resort becomes a loner's trend
From the dark trenches of the deep seas
To the silent sheds of the Amazon trees
A life spent on scavenging peace
And never does the urge to ever seize
 
Solitude seems to guarantee
It gives us freedom, like genie to Aladdin
We think we've found it, and it was meant to be
But for how long does it last?
A present life burdened by the past
Memories imprinted like childhood scars
Satisfaction only enjoyed from the stars
 
It's a painful truth that no matter the comfort we enjoy in our loner's zone
One day or another, we will feel alone
That is why we need people, real people
It's not bad luck that we encounter bad companions
It's just a reminder that not every shoulder is a leaning beacon
 
Be patient with your life, and keep your eyes open
If you're keen enough, you'll see one
Pure hearted, loving, supportive, shiny, and golden
It's that single encounter that changes the story
A new chapter, new pages, new setting and new characters
All in the same book, by the same narrator, YOU
 
The only limitation is that the past story
Can never resurface
But the new one has a milestone of pages to cover
Anything can happen, it's just up to the author
 
No man is an island
Keep your heart open
Don't be afraid
No matter the countless loops a rollercoaster makes,
it'll still end up where it started then — the ground
You were born happy
You'll end up happy`,
    date: '2024'
  },
  {
    id: 9,
    title: "THERE'S OKAY IN BARELY OKAY",
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'I still remember it vividly, It was a bright Sunday afternoon...',
    fullPoem: `I still remember it vividly
It was a bright Sunday afternoon
The Sky was sunny, clearer and blue
Boredom struck me to the core
I was so lonely and craved for more
So I decided to visit an old friend of mine
Since contact had been a really long time
The longing for connection I couldn't overlook
There was no stopping me, that taxi I had to book
When I arrived the rain was dropping
A stern face with her eyebrows dropping
I asked her what's wrong and she said she was in heartbreak
Her boyfriend had dumped her and her life was a train wreck
I sat quiet and didn't know what to say
I understood her pain but it wasn't worth the tear stray
Momentary scars that could heal in a day
I told her to kneel and together we should pray
Before I departed I had to ask
"This is the last time that I'm gonna ask"
"How are you" she said barely okay
Then I said,
At least there's an okay in barely okay
 
I missed him, sad we had to meet in that way
My uncle, that had long been gone for years
Always dreamt he'd come and buy me a new bike
Before he bought it, his life was on spikes
The car he boarded to work overturned
Soon as I heard the news my heart burned
I wished I could help him, my hand I could lend
But he had many bone fractures the doctors had to mend
Time flew fast and his recovery was quick
The moment he woke up he said he felt weak
To his surprise he couldn't feel his leg
A shouting stutter "where's my leg gone i beg"
He sobbed and sobbed and sat on the corner
If only he knew the length of his coma
I felt his loss, but gratitude was solace
At least on his own, foodstuffs he could forage
I asked him how are you he said barely okay
Then I said you know what,
In that theatre, someone is not even barely okay
 
A frustrated face behind the stage on that Christmas night
A few minutes before he performed that pluck
The strings of the guitar got tangled and stuck
He feared for his reputation
For an awful performance was what he never had
It was the first day I saw the tears of a guitarist
From heartwarming melodies to the face of wist
But I comforted him, my hand on his wrist
A disheartened man behind a melody starving mist
There was no other way
He needed to save it for another day
Broken I knew otherwise he couldn't play
I asked him man how are you he said barely okay
I said you know what?
At least there's an okay in barely okay
 
So my friends, please take heart
Limitless are the desires of the heart
I understand we intermittently grieve our loss
But isn't happiness what matters the most?
A bird in hand is worth two in the bush
Why do you weep about an unsung flute
One's life out there has just been put on mute
Let's learn to find joy in the simplest of things
True, human beings are complex beings
But never let that ever make you feel weak
There's an okay in barely okay`,
    date: '2024'
  },
  {
    id: 10,
    title: 'INFINIVERSE',
    section: 'INFINITE THOUGHTS',
    excerpt: 'In the infiniverse, where stars are born...',
    fullPoem: `In the infiniverse, where stars are born
And galaxies stretch beyond what's sworn
I find myself, a soul adrift
Yearning for the infinite, my heart's rift
Continuous echoes tuned by the joyful vocals
Pitched from the stretching of my Adam's apple
The light I see, not stained by a single bit of shade
 
In this resonance, I find my way
Through the infiniverse, night and day
A path unwinding, like a river's flow
Leading me to secrets, yet unknown

Feeling contented with peace, I proudly show
From my head to the tip of my toe
No defined pattern, both columns and rows
The scent of freedom, the fragrance of rose
 
In this state of bliss, I find my voice
A melody that echoes, a heartfelt choice
To dance with the universe, wild and free
Embracing the beauty, that's meant to be
 
No death, just immortal beings
Blood nor pain, everyone sees
Clear vision, all keenest of sight
Free of sin, but moral delight
 
In this realm of wonder, we roam and play
Where love and wisdom guide us, every step of the way
With hearts full of kindness, and minds full of light
We dance through eternity, in pure delight
 
In wisdom and faith, we surely strive
Accumulators of spiritual will, our souls they drive
Bubbles of weakness and desperation
We remove the recess with amalgamation
Prayers solid and virtual, no apparition
All is real, see the mirror of redemption`,
    date: '2024'
  },
  {
    id: 11,
    title: 'WHAT IF',
    section: 'INFINITE THOUGHTS',
    excerpt: 'What if I died today, Breath seizure comes my way...',
    fullPoem: `What if I died today
Breath seizure comes my way
blood my heart no longer relays.
Will I face God?
Will I look God in the eyes confidently
And say lord I've done your will
stood stiff as a quill
On your ways I was still
All this time I've been real
That I prayed and skipped at least a meal
All for you my lord
Will I?
 
It's a misfortune
Failing to comply with his rules
Masqueraded in fake love and sympathy
Nothing good behind just jeopardy.
Clung to living a life of fallacy
Prayers loud, sins masked, pride in redundancy
 
You have it all, you're rich
You fast, days pass, baptised and you even preach
But what if you're cleanliness denied, poor in spirit
The gate opens to those in merit
 
There is no better time
Let's prepare ourselves
There is no better path
Path to everlasting life
The only glamour to walk in eternal light
Against all the battles lined up for you, God will fight.
 
Unfortunately, we lack sight at most
When it's salvation, it comes at a cost
It's not jewellery, mansions, prestiged vehicles nor coins
Pity won't buy it, neither will wealth.
Only the size of a mustard seed of Faith
 
Let's emulate him
Be rimmed by his kind
Be fenced by his words.
We know for wild animals he raids
Are we not more precious than birds
 
Don't we fear hell?
A place with a story, scary to tell
Just a step forward is all it takes
Freedom and peace is what it makes
A hurdle free life isn't guaranteed
But breakthrough and persevering strength is indeed
 
With each passing day the invite is open
It's nothing fancy, honor and it is not modern
But at the end of it all you'll be okay
It is God's way`,
    date: '2024'
  },
  {
    id: 12,
    title: 'IF BIRTH HAD ANESTHESIA',
    section: 'INFINITE THOUGHTS',
    excerpt: 'Ever wondered? If birth had anesthesia...',
    fullPoem: `Ever wondered?
If birth had anesthesia
Would it have a meaning?
If labour bore no pain
Would it be fulfilling? No
Some say pain marks the convenience of the being to come
The essence and soulful nature of that specific period of time
Word taking time right?

Negligible stings during birth
How would we even describe it 
The divine creator had a reason
Metaphors in his words on this they reason
But what if birth had anesthesia
Would the value of a child even be appreciated
Would the existence alone be anything precious

We strive for eternal freedom
But would it be worth it
A world with no pain nor suffering
Salvation and liberty forever shimmering

Imagine how pain shapes a person
The determination and perseverance it instills
The purposeful life it creates 
The goals and system it helps one set and build
Isn't it worth it
Wouldn't we miss that

A world without pain implies a world without boundaries
Where all life lies on the same meniscus
No high nor lower class
No worker no employee 
Ever wondered?`,
    date: '2024'
  },
  {
    id: 13,
    title: "WE'RE ALL CIRCUMCISED",
    section: 'SOCIETY AND REALITY CHECK',
    excerpt: "We're all circumcised, In the midst of these jovial faces broken hearts lie...",
    fullPoem: `We're all circumcised
In the midst of these jovial faces broken hearts lie
Among these agile hands and feet rests unbearable bitter pie
Tell me how are we not circumcised?
The pain and disappointments on our heads
The freedom we yearn for, worth priceless beads
 
We're all circumcised
Tell me who doesn't bear the weight of the evil doings of these greedy politicians
Unfulfilled promises piercing through our skins
In their eyes we're just little weaklings
Puppets to be used for deeds of their likings
How are we not circumcised
The sensation we endure like surgery without anesthesia
So sad such moments always linger
 
We're all circumcised
We spend over half our lives grappling knowledge in school
All to secure high paying jobs and look cool
But belated success never loosens from our skin
Like juicy sutures and gauze clinging together
Hurt feelings and thoughts seem forever
We're all circumcised
One sources capital to start a business
Humble beginnings his hands can witness
But then taxes seem to be the weakness
Setbacks sharp as the theatre scalpels
Between profits and taxes he has to tackle
Hell Caesar
 
We're all circumcised
An innocent young lady can't access a job without offering her body as sacrifice
She's nothing else than mere merchandise
You hear the boss say there's a price to pay
To get the spot on her he must lay
How are we not circumcised
They tell an intern to have 10 years experience so he can sit on the chair
How can a person's heart be polluted as air
Swollen eyes like day two of circumcision
The torture overflows with no restrictions
 
We're all circumcised
Tell me why do decisions made by the leaders only impact the poor citizens
You decline peaceful agreements in the comfort of your offices
Yet the effects of the atomic bombs and missiles are felt by the innocents
How are we not circumcised
Lost hope aching and burning in our hearts like iodine
Resentment we can't digest like ptyalin
Grinding hard for the final aesthetic prospective
Or so we think
 
We're all circumcised
What crime do people born with the defective melanin gene commit
They can't even go jog to stay fit
Fearing the hungry predators of their own species
Confined like astronauts in space suits
Caught up in circles of freedom pursuit 
The able enter DAPP stores to sweep off the remaining cheap clothes
Leaving the high priced ones for the poor
Tears from our eyes never cease to pour
 
We're all circumcised
Who hasn't felt the excruciating pain of this world
We can't even pronounce the word
That describes what we're going through
Or whatever we're about to
It's clear we might need another set of eyes
These two are burdened by a stream of tears they failed to handle
The peace we once enjoyed now we just mumble
Upon paradisiacal life we stumble
By now everyone has realised
Truly, we're all circumcised`,
    date: '2024'
  }
]

const sections = [
  { id: 'BROKEN AND BECOMING', icon: Heart, description: 'Before something becomes, it must break. The cracks let in light, the fractures tell the story.' },
  { id: 'LIGHT THROUGH THE STORM', icon: Sparkles, description: 'Even in shadowed corners, light finds a way to seep through. Hope always whispers.' },
  { id: 'INFINITE THOUGHTS', icon: Infinity, description: 'Thoughts that stretch beyond language, drifting like stars across the mind\'s horizon.' },
  { id: 'SOCIETY AND REALITY CHECK', icon: TrendingUp, description: 'Staring at the world we live in — its masks, its wounds, its strange traditions.' }
]

export default function PoetryPage() {
  const [selectedPoem, setSelectedPoem] = useState<typeof poems[0] | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const filteredPoems = activeSection 
    ? poems.filter(p => p.section === activeSection)
    : poems

  const poemsBySection = sections.map(section => ({
    ...section,
    poems: poems.filter(p => p.section === section.id)
  }))

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-5xl px-4 sm:px-6 mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 mb-4">
            <PenTool size={28} className="text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Threads of Becoming
          </h1>
          <p className="text-text-muted mt-3 max-w-xl mx-auto">
            Poems on Life, Growth, and Struggle — by Joel Kaudzu
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm">13 Poems</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm">4 Sections</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm">2024 Collection</span>
          </div>
          
          {/* Buy Collection Button - ADDED HERE */}
          <Link
            href="/poetry/buy"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all mt-6 shadow-lg"
          >
            <BookOpen size={18} />
            Buy Collection - MK 200
          </Link>
        </motion.div>

        {/* Section Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          <button
            onClick={() => setActiveSection(null)}
            className={`p-3 rounded-xl text-center transition-all ${
              activeSection === null
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30'
            }`}
          >
            <BookOpen size={20} className="mx-auto mb-1" />
            <span className="text-sm font-medium">All Poems</span>
            <span className="text-xs block opacity-75">{poems.length} poems</span>
          </button>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30'
              }`}
            >
              <section.icon size={20} className="mx-auto mb-1" />
              <span className="text-sm font-medium line-clamp-1">{section.id}</span>
              <span className="text-xs block opacity-75">{poemsBySection.find(s => s.id === section.id)?.poems.length || 0} poems</span>
            </button>
          ))}
        </div>

        {/* Active Section Description */}
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center"
          >
            <p className="text-text-secondary text-sm italic">
              {sections.find(s => s.id === activeSection)?.description}
            </p>
          </motion.div>
        )}

        {/* Poems Grid by Section */}
        {!activeSection ? (
          // Show poems grouped by section
          <div className="space-y-10">
            {sections.map(section => {
              const sectionPoems = poems.filter(p => p.section === section.id)
              if (sectionPoems.length === 0) return null
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                    <section.icon size={18} className="text-amber-500" />
                    <h2 className="text-lg font-semibold text-text-primary">{section.id}</h2>
                    <span className="text-xs text-text-muted">{sectionPoems.length} poems</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sectionPoems.map((poem, index) => (
                      <motion.button
                        key={poem.id}
                        onClick={() => setSelectedPoem(poem)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all text-left"
                      >
                        <h3 className="font-bold text-text-primary group-hover:text-amber-500 transition-colors">
                          {poem.title}
                        </h3>
                        <p className="text-text-muted text-sm mt-1 line-clamp-2">
                          {poem.excerpt}
                        </p>
                        <div className="mt-2 text-amber-500 text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read poem <ChevronRight size={10} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // Show poems in selected section as grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoems.map((poem, index) => (
              <motion.button
                key={poem.id}
                onClick={() => setSelectedPoem(poem)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all text-left"
              >
                <h3 className="font-bold text-text-primary group-hover:text-amber-500 transition-colors">
                  {poem.title}
                </h3>
                <p className="text-text-muted text-sm mt-1 line-clamp-2">
                  {poem.excerpt}
                </p>
                <div className="mt-2 text-amber-500 text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read poem <ChevronRight size={10} />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* About the Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <PenTool size={18} className="text-amber-500" />
            <h2 className="text-lg font-semibold">About the Author</h2>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Joel Kaudzu is a premed dental surgery student at Kamuzu University of Health Sciences, 
            a poet, an innovator, and a lifelong learner. Through poetry, Joel channels his deepest 
            emotions, reflections, and observations about life, society, and the human condition. 
            His work explores pain, perseverance, hope, innovation, and the infinite thoughts that 
            shape our experiences. This collection is a testament to the power of resilience, 
            reflection, and faith — inspiring others to embrace their vulnerabilities and navigate 
            life with courage, integrity, and vision.
          </p>
          <div className="mt-3 text-xs text-text-muted italic">
            "Poetry has shaped my communication ability, emotional intelligence, and perspective as both a creator and problem solver." — Joel George Kaudzu
          </div>
        </motion.div>

        {/* Closing Scripture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-text-muted italic">
            Jeremiah 29:11 — "For I know the plans I have for you, declares the Lord, 
            plans to prosper you and not to harm you, plans to give you hope and a future."
          </p>
        </motion.div>
      </div>

      {/* Poem Modal */}
      <AnimatePresence>
        {selectedPoem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPoem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPoem(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
              >
                <X size={18} />
              </button>
              
              <div className="p-6">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-amber-500">{selectedPoem.section}</span>
                  <h2 className="text-xl font-bold text-text-primary mt-1">{selectedPoem.title}</h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-text-secondary whitespace-pre-line font-serif leading-relaxed">
                    {selectedPoem.fullPoem}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 text-right">
                  <span className="text-xs text-text-muted">— Joel Kaudzu, {selectedPoem.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}