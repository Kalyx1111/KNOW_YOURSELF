/* =========================================================================
   KNOW YOURSELF — by Aryan
   A research-grounded personality intelligence engine combining:
   - The Five-Factor Model / Big Five (Costa & McCrae; facet structure per
     Goldberg\'s IPIP proxy of the NEO-PI-R\'s 30 facets)
   - A Jungian-derived 16-type overlay, empirically anchored to the Big Five
     via the documented FFM↔MBTI correlations (McCrae & Costa, 1989,
     "Reinterpreting the Myers-Briggs Type Indicator From the Perspective
     of the Five-Factor Model of Personality") plus four dedicated
     dichotomy scales for resolution the Big Five alone doesn\'t capture
   - Adult attachment style, per Bowlby\'s attachment theory and the
     four-category model (Bartholomew & Horowitz, 1991)
   All content below is written originally for this product. No copyrighted
   test items or type-descriptions are reproduced from any commercial
   instrument (NEO-PI-R, MBTI®, 16Personalities, etc). This tool is for
   self-reflection, not clinical diagnosis.
   ========================================================================= */

const STORE_KEY = 'ky_state_v1';
const HISTORY_KEY = 'ky_history_v1';
const XP_KEY = 'ky_xp_v1';

/* ---------------------------------------------------------------------
   1. BIG FIVE — 60 items, 5 traits × 6 facets × 2 items (1 keyed +, 1 keyed -)
   --------------------------------------------------------------------- */
const BIG_FIVE_FACETS = {
  O: ['Imagination','Aesthetic Sensitivity','Emotional Depth','Adventurousness','Intellectual Curiosity','Open-Mindedness'],
  C: ['Self-Efficacy','Orderliness','Dutifulness','Achievement-Striving','Self-Discipline','Cautiousness'],
  E: ['Friendliness','Gregariousness','Assertiveness','Activity Level','Excitement-Seeking','Cheerfulness'],
  A: ['Trust','Straightforwardness','Altruism','Cooperation','Modesty','Sympathy'],
  N: ['Anxiety','Anger Reactivity','Low Mood','Self-Consciousness','Immoderation','Vulnerability to Stress'],
};
const TRAIT_NAMES = {O:'Openness',C:'Conscientiousness',E:'Extraversion',A:'Agreeableness',N:'Neuroticism'};
const TRAIT_COLOR = {O:'#8b7ff0',C:'#c9a961',E:'#e39a9a',A:'#8fbfa0',N:'#7fa8c9'};

const bigFiveItems = [
  // OPENNESS
  ['O',0,1,"I spend time exploring imaginary scenarios and possibilities."],
  ['O',0,-1,"I rarely daydream or picture alternate outcomes to things."],
  ['O',1,1,"I\'m deeply moved by art, music, or design."],
  ['O',1,-1,"Aesthetic experiences don\'t really do much for me."],
  ['O',2,1,"I\'m in touch with my emotions and can usually name what I feel."],
  ['O',2,-1,"I find it hard to identify what I\'m actually feeling."],
  ['O',3,1,"I actively seek out new experiences and unfamiliar situations."],
  ['O',3,-1,"I\'d rather stick to what\'s familiar and already tested."],
  ['O',4,1,"I enjoy wrestling with abstract theories and ideas for their own sake."],
  ['O',4,-1,"Abstract discussions feel like a waste of time to me."],
  ['O',5,1,"I\'m willing to reconsider my views when I meet new evidence."],
  ['O',5,-1,"Once I\'ve formed an opinion, I rarely revisit it."],
  // CONSCIENTIOUSNESS
  ['C',0,1,"I trust my ability to handle whatever comes my way."],
  ['C',0,-1,"I often doubt my ability to get things done well."],
  ['C',1,1,"I keep my space, files, and schedule well organized."],
  ['C',1,-1,"My workspace and plans tend to be pretty chaotic."],
  ['C',2,1,"I take my commitments seriously, even the small ones."],
  ['C',2,-1,"I sometimes let people down on things I said I\'d do."],
  ['C',3,1,"I set ambitious goals for myself and push hard to reach them."],
  ['C',3,-1,"I\'m content doing just enough to get by."],
  ['C',4,1,"I follow through on tasks even after the initial motivation fades."],
  ['C',4,-1,"I tend to abandon things once the novelty wears off."],
  ['C',5,1,"I think things through carefully before I act."],
  ['C',5,-1,"I often act first and think about it later."],
  // EXTRAVERSION
  ['E',0,1,"I warm up to new people quickly."],
  ['E',0,-1,"It takes me a long time to warm up to strangers."],
  ['E',1,1,"I feel energized in large groups and gatherings."],
  ['E',1,-1,"Crowded social events drain me fairly quickly."],
  ['E',2,1,"I naturally take the lead in group settings."],
  ['E',2,-1,"I hold back rather than take charge of a group."],
  ['E',3,1,"I keep a fast pace and like staying constantly busy."],
  ['E',3,-1,"I prefer a slow, unhurried pace of life."],
  ['E',4,1,"I chase thrills and crave a bit of stimulation."],
  ['E',4,-1,"I avoid risky or overstimulating situations."],
  ['E',5,1,"I radiate upbeat, positive energy most of the time."],
  ['E',5,-1,"I rarely feel or express much excitement."],
  // AGREEABLENESS
  ['A',0,1,"I generally assume people have good intentions."],
  ['A',0,-1,"I assume people are out for themselves until proven otherwise."],
  ['A',1,1,"I\'m direct and honest, even when it\'s uncomfortable."],
  ['A',1,-1,"I\'ll soften or bend the truth to avoid conflict."],
  ['A',2,1,"I go out of my way to help people, even strangers."],
  ['A',2,-1,"Helping others isn\'t really high on my priority list."],
  ['A',3,1,"I\'d rather compromise than fight hard for my own way."],
  ['A',3,-1,"I push hard for my position when there\'s a disagreement."],
  ['A',4,1,"I tend to downplay my own achievements."],
  ['A',4,-1,"I make sure people notice what I\'ve accomplished."],
  ['A',5,1,"Other people\'s pain genuinely affects me."],
  ['A',5,-1,"I stay logical rather than getting swept into others\' emotions."],
  // NEUROTICISM
  ['N',0,1,"I worry about things that might go wrong."],
  ['N',0,-1,"I rarely feel anxious, even under real pressure."],
  ['N',1,1,"I get irritated fairly easily."],
  ['N',1,-1,"It takes a lot to actually make me angry."],
  ['N',2,1,"I often feel discouraged or low."],
  ['N',2,-1,"I bounce back quickly from setbacks."],
  ['N',3,1,"I feel exposed and uneasy around people I don\'t know well."],
  ['N',3,-1,"I feel at ease no matter who\'s in the room."],
  ['N',4,1,"I struggle to resist temptations and impulses."],
  ['N',4,-1,"I find it easy to resist cravings and urges."],
  ['N',5,1,"I feel overwhelmed when pressure starts to mount."],
  ['N',5,-1,"I stay composed even in high-pressure situations."],
];

/* ---------------------------------------------------------------------
   2. DICHOTOMY SCALES — 40 items, 4 scales × 10 items (all keyed toward
   the named pole: E, N(intuition), F, J)
   --------------------------------------------------------------------- */
const dichotomyItems = [
  // ENERGY SOURCE -> E pole
  ['EI', "Being around people boosts my energy more than it drains it."],
  ['EI', "I process my thoughts best by talking them through out loud."],
  ['EI', "I look forward to parties, networking events, or group gatherings."],
  ['EI', "I\'d rather collaborate in a room full of people than work solo."],
  ['EI', "Long stretches of solitude leave me restless rather than restored."],
  ['EI', "I naturally strike up conversations with strangers."],
  ['EI', "I\'m comfortable being the center of attention."],
  ['EI', "My ideal weekend involves being out and socializing."],
  ['EI', "I recover energy faster around people than in quiet alone-time."],
  ['EI', "I speak up quickly in meetings rather than waiting to be asked."],
  // INFORMATION STYLE -> N (intuition) pole
  ['SN', "I focus more on future possibilities than present realities."],
  ['SN', "I trust hunches and patterns over hard, concrete data."],
  ['SN', "I get more excited by concepts and theories than practical detail."],
  ['SN', "I naturally see the big picture before I notice the details."],
  ['SN', "I enjoy speculating about 'what could be\' more than describing 'what is.'"],
  ['SN', "I connect seemingly unrelated ideas fairly easily."],
  ['SN', "I\'d rather read about a general theory than a step-by-step manual."],
  ['SN', "I trust my instinct about a new situation faster than the facts about it."],
  ['SN', "I get bored quickly with routine, well-established procedures."],
  ['SN', "I lean toward symbolic or abstract explanations over literal ones."],
  // VALUES BASIS -> F pole
  ['TF', "When making a tough call, I weigh how people will feel first."],
  ['TF', "I find it hard to give critical feedback that might hurt someone."],
  ['TF', "Harmony in a group matters more to me than being 'right.'"],
  ['TF', "I decide based on personal values more than strict logic."],
  ['TF', "I notice the emotional undertone of a room almost instantly."],
  ['TF', "I\'d rather be seen as compassionate than as strictly fair."],
  ['TF', "I take criticism personally, even when it\'s meant constructively."],
  ['TF', "I go out of my way to avoid conflict."],
  ['TF', "I weigh context and individual circumstance before applying a rule."],
  ['TF', "My decisions are guided more by empathy than by objective analysis."],
  // DECISION & STRUCTURE -> J pole
  ['JP', "I like having a plan and sticking to it."],
  ['JP', "Unfinished tasks bother me until they\'re done."],
  ['JP', "I make decisions quickly and move on, rather than keeping options open."],
  ['JP', "I prefer a structured schedule over a loose, flexible one."],
  ['JP', "I\'d rather close out a decision than leave it open-ended."],
  ['JP', "Deadlines motivate me to finish early rather than at the last minute."],
  ['JP', "I feel unsettled when plans change at the last minute."],
  ['JP', "I make to-do lists and actually follow them."],
  ['JP', "I prefer knowing what to expect over being spontaneous."],
  ['JP', "I like tying up loose ends before starting something new."],
];

/* ---------------------------------------------------------------------
   3. ATTACHMENT — 12 items, 3 per style (Bartholomew & Horowitz 1991)
   --------------------------------------------------------------------- */
const attachmentItems = [
  ['secure', "I\'m comfortable depending on others and having them depend on me."],
  ['secure', "I trust that people close to me will be there when it matters."],
  ['secure', "I can be close to someone without losing my sense of self."],
  ['anxious', "I often worry that people don\'t care about me as much as I care about them."],
  ['anxious', "I need frequent reassurance that I\'m valued in my close relationships."],
  ['anxious', "I get anxious when someone I\'m close to seems distant."],
  ['avoidant', "I prefer to handle problems on my own rather than lean on others."],
  ['avoidant', "I feel uneasy when someone gets too emotionally close to me."],
  ['avoidant', "I value my independence more than being deeply attached to someone."],
  ['fearful', "I want closeness, but I\'m afraid of getting hurt if I let someone in."],
  ['fearful', "I find myself pulling away right when a relationship starts to deepen."],
  ['fearful', "My feelings about getting close to people are conflicted and hard to pin down."],
];

const attachmentProfiles = {
  secure:{
    name:'Secure', tag:'Grounded & Trusting',
    desc:"You\'re generally at ease with both intimacy and independence. You can lean on people without losing yourself, and let people lean on you without feeling burdened. Conflict doesn\'t threaten the relationship\'s foundation for you — you address it and move on.",
    traits:['Comfortable with closeness','Communicates needs directly','Resilient after conflict','Trusts without being naive'],
  },
  anxious:{
    name:'Anxious (Preoccupied)', tag:'Craves Closeness & Reassurance',
    desc:"Relationships matter enormously to you, sometimes to the point of preoccupation. You\'re highly attuned to shifts in a partner or friend\'s warmth, and can read distance into ordinary silence. Your care runs deep — the growth edge is self-soothing instead of outsourcing your sense of security.",
    traits:['Deeply attuned to others','Values connection highly','Sensitive to perceived distance','Benefits from direct reassurance'],
  },
  avoidant:{
    name:'Avoidant (Dismissive)', tag:'Independent & Self-Contained',
    desc:"You function well alone and prize your autonomy. Emotional intensity from others can feel like an imposition, so you keep a comfortable amount of distance even in relationships you value. Your growth edge is letting people in before distance becomes the default.",
    traits:['Highly self-reliant','Calm under emotional pressure','Values personal space','Growth edge: vulnerability'],
  },
  fearful:{
    name:'Fearful-Avoidant (Disorganized)', tag:'Wants Closeness, Fears It Too',
    desc:"You hold two true things at once: a real desire for closeness, and a real fear of what closeness has cost you before. This can look like pursuing connection and then retreating once it deepens. Naming the pattern is usually the first unlock — the pull isn\'t contradiction, it\'s protection.",
    traits:['Deeply values connection','Highly self-protective','Pattern-aware once named','Growth edge: consistency'],
  },
};

/* ---------------------------------------------------------------------
   4. 16 TYPE PROFILES
   --------------------------------------------------------------------- */
const TYPES = {
  INTJ:{name:'The Architect', ess:'Strategic systems-thinker who sees the endgame before others see the first move.',
    desc:"You build models of how things work and quietly stress-test them against reality. Independence isn\'t a preference for you, it\'s an operating requirement — you think best when nobody\'s watching. People experience you as calm, exacting, and hard to rattle, because you usually already war-gamed the scenario in your head.",
    strengths:['Long-range strategic thinking','Decisive once the model is built','Intellectually independent','Unfazed by criticism of ideas'],
    growth:["Can dismiss input before hearing it out","May under-communicate the why behind decisions","Patience for execution details wears thin"],
    careers:['Systems / strategy architecture','Investment & venture analysis','R&D leadership','Policy design','Technical founder'],
    comm:"State the conclusion first, then invite challenge — you respect people who push back with a real argument."},
  INTP:{name:'The Analyst', ess:'Precise, curious thinker who takes ideas apart to see how they actually work.',
    desc:"You\'re driven less by 'get it done\' and more by 'get it right.' Inconsistency in an argument bothers you more than an unfinished to-do list. You\'d rather sit with an unsolved problem than ship a shaky answer, which makes you a superb diagnostician and an occasionally frustrating collaborator on deadlines.",
    strengths:['Rigorous, structural logic','Comfortable with ambiguity','Original, non-consensus thinking','Honest about what it doesn\'t know'],
    growth:['Analysis can stall action indefinitely','Underplays the emotional layer of decisions','Follow-through on routine tasks'],
    careers:['Research science','Software architecture','Quantitative analysis','Philosophy / theory-heavy fields','Independent consulting'],
    comm:"Give the reasoning, not just the ask — you engage when you can see the logic, not just the instruction."},
  ENTJ:{name:'The Commander', ess:'Decisive, big-picture leader who turns ambition into organized execution.',
    desc:"You see the destination and build the org chart to get there. Inefficiency personally offends you, and you\'ll restructure a broken process without waiting for permission. People follow you because you make the plan legible — the risk is moving faster than the room\'s buy-in.",
    strengths:['Natural, confident leadership','Turns vision into a workable plan','Comfortable making hard calls','High personal standards'],
    growth:['Can steamroll quieter voices','Impatience with slower processors','Delegating without micromanaging'],
    careers:['Executive leadership','Management consulting','Business development','Operations at scale','Founder / CEO'],
    comm:"Bring the plan, not just the problem — and expect direct pushback rather than deference."},
  ENTP:{name:'The Innovator', ess:'Quick-witted debater who thrives on possibility and reinventing what already works.',
    desc:"You get a jolt of energy from picking apart the assumption everyone else accepted. Brainstorm sessions are your habitat; maintenance mode is not. You can argue a position you don\'t even hold just to see if it survives contact — which is exhilarating to some collaborators and exhausting to others.",
    strengths:['Rapid, associative idea generation','Comfortable challenging consensus','Persuasive, energetic communicator','Adapts fast to new information'],
    growth:['Follow-through past the exciting phase','Can argue for sport at the wrong moment','Underestimates how ideas land emotionally'],
    careers:['Product strategy','Entrepreneurship','Venture capital','Innovation consulting','Media / commentary'],
    comm:"Debate the idea, not the person — you mean the challenge as engagement, not attack, so say that upfront to new collaborators."},
  INFJ:{name:'The Confidant', ess:'Quietly intense idealist who reads people deeply and pursues meaning over convenience.',
    desc:"You notice the undercurrent in a room before anyone names it, and you hold a private, exacting vision of how things should be. You give generously but selectively — trust is earned, not assumed. Burnout risk is real for you, because you absorb more of other people\'s weight than you let on.",
    strengths:['Deep, intuitive read on people','Strong internal values compass','Sees long-term implications early','Quietly persuasive'],
    growth:['Over-absorbs others\' emotional weight','Can withdraw instead of confronting',"Perfectionism about finding the meaningful path"],
    careers:['Counseling / psychology','Strategic communications','Nonprofit leadership','Writing / narrative design','Human-centered design'],
    comm:"Give context and space, not urgency — you open up when the conversation feels safe, not when it\'s rushed."},
  INFP:{name:'The Idealist', ess:'Values-driven dreamer guided by an inner moral compass and a rich imagination.',
    desc:"You measure decisions against an internal sense of what\'s right, even when it\'s inconvenient. Your inner world is vivid and often richer than what makes it to the surface. When something violates your values you\'ll go quiet rather than argue — which people sometimes misread as disengagement.",
    strengths:['Strong, authentic values','Empathic, non-judgmental listener','Creative, original inner world','Loyal once trust is earned'],
    growth:['Conflict-avoidance masks real disagreement','Can idealize people or plans early','Structure and deadlines feel constraining'],
    careers:['Creative writing / arts','Counseling','UX / design','Advocacy & nonprofit work','Independent creative business'],
    comm:"Ask what matters to them before what they\'ll do — motivation has to connect to a value, not just a deadline."},
  ENFJ:{name:'The Catalyst', ess:'Warm, persuasive motivator who brings out the best in the people around them.',
    desc:"You read a room\'s emotional temperature instantly and instinctively know what will move people. Mentoring, organizing, and rallying come naturally — you get real energy from watching someone grow because of something you said. The cost is neglecting your own needs while managing everyone else\'s.",
    strengths:['Natural motivator and mentor','High emotional intelligence','Organizes people around a shared goal','Persuasive, warm communicator'],
    growth:['Over-extends for others at personal cost','Can take feedback about people personally','Struggles to sit with unresolved conflict'],
    careers:['People leadership / HR','Teaching & education','Coaching','Public-facing brand leadership','Community organizing'],
    comm:"Acknowledge the relationship before the request — task-only conversations feel transactional to you."},
  ENFP:{name:'The Explorer', ess:'Enthusiastic connector who chases possibility and lights up rooms with curiosity.',
    desc:"You fall in love with ideas fast and bring people along with your enthusiasm. Routine is the enemy of your energy; a new thread of possibility is the fuel. You form genuine, fast connections with people — the challenge is sustaining follow-through once the initial spark fades.",
    strengths:['Contagious enthusiasm and warmth','Strong, fast interpersonal connection','Sees unconventional possibilities','Adapts quickly, improvises well'],
    growth:['Follow-through past the honeymoon phase','Overcommits across too many threads','Structure feels like a cage, not a scaffold'],
    careers:['Marketing & brand strategy','Entrepreneurship','Journalism / content creation','Public relations','Talent / people-facing roles'],
    comm:"Bring energy and let ideas breathe before nailing down logistics — over-structuring the first conversation shuts you down."},
  ISTJ:{name:'The Steward', ess:'Methodical, dependable executor who honors commitments and keeps things running.',
    desc:"You\'re the person a system can be built around — thorough, punctual, and allergic to cutting corners. You trust track record over charisma, and you\'d rather be quietly right than loudly impressive. New, untested methods have to earn their place before you\'ll adopt them.",
    strengths:['Extremely reliable follow-through','Strong attention to detail','Respects process and precedent','Calm, steady under routine pressure'],
    growth:['Resistant to unproven new approaches','Can under-communicate reasoning','Struggles to improvise off-script'],
    careers:['Operations & logistics','Accounting / finance','Law & compliance','Project management','Engineering execution'],
    comm:"Give the concrete facts and a clear ask — abstract framing without a next step reads as unfinished to you."},
  ISFJ:{name:'The Guardian', ess:'Quietly devoted caretaker who notices what people need before they ask.',
    desc:"You track the small, practical needs of the people around you without being asked — and you remember them long after most people would forget. Your loyalty runs deep and mostly silent. You\'ll absorb inconvenience yourself rather than make it someone else\'s problem, sometimes past the point that\'s healthy for you.",
    strengths:['Attentive, practical care for others','Exceptionally loyal and dependable','Strong memory for personal detail','Steady under pressure'],
    growth:['Struggles to ask for help in return','Avoids necessary confrontation','Can over-give past its own limits'],
    careers:['Healthcare & nursing','Administration & operations','Education (early years)','HR & employee support','Hospitality management'],
    comm:"State needs plainly — you\'ll happily meet them, but you won\'t always guess what\'s unspoken."},
  ESTJ:{name:'The Director', ess:'Organized, results-driven manager who brings order and accountability to any group.',
    desc:"You default to structure: clear roles, clear timelines, clear consequences. Ambiguity is friction to you, so you resolve it fast, sometimes faster than the room wants. People trust you to keep a project on the rails — the growth edge is making room for approaches that don\'t look like yours.",
    strengths:['Strong organizational execution','Clear, direct communication','Holds people accountable fairly','Decisive under time pressure'],
    growth:["Can be inflexible about what counts as the right way","Underweights emotional context","Impatient with open-ended exploration"],
    careers:['Operations management','Military / law enforcement leadership','Project & program management','Business administration','Manufacturing leadership'],
    comm:"Lead with the bottom line and a clear ask — build the case after, not before."},
  ESFJ:{name:'The Host', ess:'Sociable organizer who keeps communities connected and traditions alive.',
    desc:"You\'re the connective tissue of most groups you\'re in — remembering birthdays, smoothing friction, making sure nobody\'s left out. Approval and harmony matter to you, and you invest real effort in both. The growth edge is tolerating disapproval when doing the right thing requires it.",
    strengths:['Builds and sustains community','Highly attentive to social needs','Organized, dependable host/planner','Generous, practical helper'],
    growth:['Over-indexes on others\' approval','Avoids conflict past the point of usefulness','Takes criticism of the group personally'],
    careers:['Event & community management','Customer / client relations','Education administration','Healthcare coordination','Sales & account management'],
    comm:"Frame requests around the shared group or outcome — 'this helps the team\' lands better than a cold, solo ask."},
  ISTP:{name:'The Craftsman', ess:'Hands-on problem-solver who stays calm under pressure and improvises fixes on the fly.',
    desc:"You\'d rather take the thing apart than read the manual about it. Crisis doesn\'t rattle you — if anything, you\'re at your best mid-emergency, diagnosing and fixing in real time. Long meetings about a problem bore you more than the problem itself does.",
    strengths:['Calm, effective under pressure','Practical, hands-on problem-solving','Independent, low ego about credit','Adapts fast to changing conditions'],
    growth:['Under-communicates plans and reasoning','Avoids long-term emotional commitment talk','Can seem detached in group settings'],
    careers:['Engineering (mechanical/field)','Emergency response','Skilled trades','Systems troubleshooting / IT','Aviation & technical operations'],
    comm:"Skip the preamble — give the problem and let them work it; too much process talk loses their attention."},
  ISFP:{name:'The Artisan', ess:'Gentle, sensory-driven creator who expresses values through action rather than words.',
    desc:"You lead with feel — for color, tone, texture, mood — more than argument. Your values run deep but you rarely announce them; you just quietly live by them and expect others to notice the pattern eventually. Pressure to perform or explain yourself in the moment can shut you down.",
    strengths:['Strong aesthetic and sensory instinct','Quiet, consistent integrity','Adaptable, present-focused','Non-judgmental toward others'],
    growth:['Avoids direct confrontation','Struggles to self-promote or advocate','Can be indecisive under external pressure'],
    careers:['Design & visual arts','Culinary arts','Music & performance','Landscape / environmental design','Veterinary & animal care'],
    comm:"Give them space and low pressure — they open up in one-on-one, unhurried settings, not put-on-the-spot ones."},
  ESTP:{name:'The Dynamo', ess:'Bold, adaptable doer who reads a room instantly and acts without hesitation.',
    desc:"You trust your instincts in the moment more than a plan drawn up in advance. Risk doesn\'t scare you, it focuses you. You\'re the person people want in the room when something\'s going sideways in real time — the growth edge is thinking two steps further out before acting.",
    strengths:['Fast, confident real-time decisions','High tolerance for risk and pressure','Persuasive, socially perceptive','Energizing presence in a crisis'],
    growth:['Under-weighs long-term consequence','Can be impulsive with commitments','Restlessness with slow, careful planning'],
    careers:['Sales & business development','Emergency & crisis management','Entrepreneurship','Sports / performance coaching','Trading & fast markets'],
    comm:"Keep it short and concrete — a long strategic preamble loses them before you get to the ask."},
  ESFP:{name:'The Performer', ess:'Spontaneous, warm entertainer who lives fully in the present moment.',
    desc:"You bring the room to life without trying to. Joy, in the moment, is a genuine priority for you, not a distraction from 'real work.' People feel immediately at ease around you — the tradeoff is that long-term planning and difficult, unglamorous grind can feel like a drag on your natural rhythm.",
    strengths:['Warm, immediate rapport with people','Genuine enthusiasm and energy','Adaptable, present-focused','Notices and responds to others\' moods'],
    growth:['Struggles with long, unglamorous grind','Avoids serious or heavy conversations','Under-plans for the medium term'],
    careers:['Performing arts & entertainment','Hospitality & events','Sales (relationship-led)','Public-facing brand roles','Fitness & wellness coaching'],
    comm:"Keep the tone light and personal before getting serious — cold, formal openers make them guarded."},
};

const DICHOTOMY_META = {
  EI:{poles:['I','E'], labels:['Introversion','Extraversion'], desc:"Where you direct and recover your energy — inward, through reflection, or outward, through interaction."},
  SN:{poles:['S','N'], labels:['Sensing','Intuition'], desc:"How you take in information — concrete and present-focused, or abstract and possibility-focused."},
  TF:{poles:['T','F'], labels:['Thinking','Feeling'], desc:"How you weigh decisions — by logical consistency, or by impact on people and values."},
  JP:{poles:['P','J'], labels:['Perceiving','Judging'], desc:"How you approach structure — staying open and flexible, or planning and closing things out."},
};

/* =========================================================================
   STATE
   ========================================================================= */
let state = {
  route:'landing',
  qIndex:0,
  answers:{},        // key: 'bf-0' | 'dc-0' | index-based unified queue id -> 1..5
  queue:[],           // unified list of {type:'bf'|'dc', idx, module}
  attachAnswers:{},
  attachQIndex:0,
  currentResult:null,
};

function buildQueue(){
  const q = [];
  bigFiveItems.forEach((item,i)=>q.push({type:'bf', idx:i, module:'Core Traits · Five-Factor Model'}));
  dichotomyItems.forEach((item,i)=>q.push({type:'dc', idx:i, module:'Cognitive Style · Typology Overlay'}));
  // interleave in blocks of 5 for pacing variety
  const bf = q.filter(x=>x.type==='bf'), dc = q.filter(x=>x.type==='dc');
  const merged = [];
  let bi=0, di=0;
  while(bi<bf.length || di<dc.length){
    for(let k=0;k<6 && bi<bf.length;k++) merged.push(bf[bi++]);
    for(let k=0;k<4 && di<dc.length;k++) merged.push(dc[di++]);
  }
  return merged;
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw){
      const saved = JSON.parse(raw);
      state.answers = saved.answers || {};
      state.qIndex = saved.qIndex || 0;
    }
  }catch(e){}
  state.queue = buildQueue();
}
function persistState(){
  try{
    localStorage.setItem(STORE_KEY, JSON.stringify({answers:state.answers, qIndex:state.qIndex}));
  }catch(e){}
}
function getXP(){ try{ return parseInt(localStorage.getItem(XP_KEY)||'0',10); }catch(e){ return 0; } }
function addXP(n){ const cur=getXP()+n; try{ localStorage.setItem(XP_KEY,String(cur)); }catch(e){} renderXP(); }
function renderXP(){ const el=document.getElementById('xp-count'); if(el) el.textContent = getXP(); }

function getHistory(){
  try{ return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }catch(e){ return []; }
}
function saveToHistory(result){
  const hist = getHistory();
  hist.unshift({
    date:new Date().toISOString(),
    type:result.type,
    traits:result.traits,
  });
  try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0,30))); }catch(e){}
}

/* =========================================================================
   SCORING
   ========================================================================= */
function scoreAssessment(){
  // Big five raw
  const traitSums = {O:0,C:0,E:0,A:0,N:0};
  const traitCounts = {O:0,C:0,E:0,A:0,N:0};
  const facetSums = {O:[0,0,0,0,0,0],C:[0,0,0,0,0,0],E:[0,0,0,0,0,0],A:[0,0,0,0,0,0],N:[0,0,0,0,0,0]};
  const facetCounts = {O:[0,0,0,0,0,0],C:[0,0,0,0,0,0],E:[0,0,0,0,0,0],A:[0,0,0,0,0,0],N:[0,0,0,0,0,0]};

  bigFiveItems.forEach((item,i)=>{
    const [trait, facetIdx, key] = item;
    const raw = state.answers['bf-'+i];
    if(raw==null) return;
    const scored = key===1 ? raw : (6-raw); // reverse-key
    traitSums[trait]+=scored; traitCounts[trait]++;
    facetSums[trait][facetIdx]+=scored; facetCounts[trait][facetIdx]++;
  });

  const traits = {};
  Object.keys(traitSums).forEach(t=>{
    traits[t] = traitCounts[t] ? Math.round((traitSums[t]/traitCounts[t]/5)*100) : 50;
  });
  const facets = {};
  Object.keys(facetSums).forEach(t=>{
    facets[t] = facetSums[t].map((sum,i)=> facetCounts[t][i] ? Math.round((sum/facetCounts[t][i]/5)*100) : 50);
  });

  // dichotomy dedicated scales
  const dcSums = {EI:0,SN:0,TF:0,JP:0}, dcCounts = {EI:0,SN:0,TF:0,JP:0};
  dichotomyItems.forEach((item,i)=>{
    const [scale] = item;
    const raw = state.answers['dc-'+i];
    if(raw==null) return;
    dcSums[scale]+=raw; dcCounts[scale]++;
  });
  const dcScale = {};
  Object.keys(dcSums).forEach(s=>{
    dcScale[s] = dcCounts[s] ? Math.round((dcSums[s]/dcCounts[s]/5)*100) : 50;
  });

  // blended dichotomy scores (50% big5 proxy, 50% dedicated scale)
  const eScore = Math.round(0.5*traits.E + 0.5*dcScale.EI);
  const nScore = Math.round(0.5*traits.O + 0.5*dcScale.SN); // intuition score
  const fScore = Math.round(0.5*traits.A + 0.5*dcScale.TF);
  const jScore = Math.round(0.5*traits.C + 0.5*dcScale.JP);

  const type =
    (eScore>=50?'E':'I') +
    (nScore>=50?'N':'S') +
    (fScore>=50?'F':'T') +
    (jScore>=50?'J':'P');

  return {
    traits, facets,
    dichotomy:{EI:eScore, SN:nScore, TF:fScore, JP:jScore},
    type,
  };
}

function scoreAttachment(){
  const sums = {secure:0,anxious:0,avoidant:0,fearful:0};
  const counts = {secure:0,anxious:0,avoidant:0,fearful:0};
  attachmentItems.forEach((item,i)=>{
    const [style] = item;
    const raw = state.attachAnswers[i];
    if(raw==null) return;
    sums[style]+=raw; counts[style]++;
  });
  let best='secure', bestScore=-1; const scores={};
  Object.keys(sums).forEach(s=>{
    const avg = counts[s]? sums[s]/counts[s] : 0;
    scores[s]=avg;
    if(avg>bestScore){bestScore=avg; best=s;}
  });
  return {style:best, scores};
}

/* =========================================================================
   ROUTING
   ========================================================================= */
function navigate(route){
  state.route = route;
  window.location.hash = route;
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active', a.dataset.route===route));
  document.getElementById('nav').classList.remove('open');
  render();
  window.scrollTo({top:0, behavior:'instant'});
}

document.addEventListener('click', (e)=>{
  const r = e.target.closest('[data-route]');
  if(r){ e.preventDefault(); navigate(r.dataset.route); }
});

window.addEventListener('hashchange', ()=>{
  const h = window.location.hash.replace('#','') || 'landing';
  state.route = h;
  render();
});

/* =========================================================================
   RENDER ROOT
   ========================================================================= */
function render(){
  const main = document.getElementById('main');
  const r = state.route;
  let html = '';
  if(r==='landing') html = renderLanding();
  else if(r==='assessment') html = renderAssessment();
  else if(r==='results') html = renderResults();
  else if(r==='types') html = renderTypes();
  else if(r==='research') html = renderResearch();
  else if(r==='compatibility') html = renderCompatibility();
  else if(r==='attachment') html = renderAttachment();
  else if(r==='attachment-quiz') html = renderAttachmentQuiz();
  else if(r==='attachment-result') html = renderAttachmentResult();
  else if(r==='history') html = renderHistory();
  else html = renderLanding();

  main.innerHTML = `<section class="view active" data-view="${r}">${html}</section>`;
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active', a.dataset.route===r));
  postRender(r);
}

function postRender(r){
  if(r==='assessment') bindAssessment();
  if(r==='results') bindResults();
  if(r==='compatibility') bindCompatibility();
  if(r==='attachment-quiz') bindAttachmentQuiz();
  if(r==='types') bindTypeCards();
}

/* =========================================================================
   LANDING
   ========================================================================= */
function renderLanding(){
  const dims = [
    {code:'O · C · E', name:'Five-Factor Core', desc:'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — the trait model with the deepest body of peer-reviewed evidence behind it.', poles:'FACETS · 30'},
    {code:'E / I', name:'Energy Direction', desc:'Where attention and energy naturally flow — outward into people and activity, or inward into reflection.', poles:'INTROVERT ↔ EXTRAVERT'},
    {code:'S / N', name:'Information Style', desc:'How you take in the world — through concrete, present detail, or abstract pattern and possibility.', poles:'SENSING ↔ INTUITION'},
    {code:'T / F', name:'Decision Basis', desc:'What carries more weight in a judgment call — logical consistency, or impact on people and values.', poles:'THINKING ↔ FEELING'},
  ];
  const typeCards = Object.entries(TYPES).map(([code,t])=>`
    <div class="type-card" data-type="${code}" data-route="types">
      <div class="code">${code}</div>
      <h4>${t.name}</h4>
      <p>${t.ess}</p>
    </div>`).join('');

  return `
  <div class="hero">
    <div class="hero-inner">
      <span class="eyebrow">A research-grounded personality intelligence platform</span>
      <h1 class="hero-title">Know your mind before<br/>the world tells you who you are — <em>precisely</em>.</h1>
      <p class="hero-sub">100 questions across the Five-Factor Model, a Jungian-derived typology overlay, and adult attachment
      theory. Facet-level analytics, a 16-type profile, a relational compatibility lens — built to be private, offline,
      and unusually thorough.</p>
      <div class="hero-cta">
        <button class="btn btn-primary" data-route="assessment">Begin the Assessment →</button>
        <button class="btn btn-ghost" data-route="types">Explore the 16 Types</button>
      </div>
      <div class="hero-stats">
        <div><strong>100</strong><span>Questions</span></div>
        <div><strong>30</strong><span>Facets</span></div>
        <div><strong>16</strong><span>Types</span></div>
        <div><strong>~15</strong><span>Minutes</span></div>
      </div>
      <div class="methodology-strip">
        <span class="method-chip">Costa &amp; McCrae · Five-Factor Model</span>
        <span class="method-chip">McCrae &amp; Costa 1989 · FFM↔MBTI Mapping</span>
        <span class="method-chip">Bartholomew &amp; Horowitz 1991 · Attachment</span>
      </div>
    </div>
  </div>

  <section class="section wrap">
    <div class="section-head">
      <span class="eyebrow">What this measures</span>
      <h2>Four lenses, one accurate picture</h2>
      <p class="section-sub">Most quizzes give you a type. This gives you the trait data underneath the type, so the result actually explains itself.</p>
    </div>
    <div class="dim-grid">
      ${dims.map((d,i)=>`
        <div class="dim-card">
          <div class="n">${d.code}</div>
          <h3>${d.name}</h3>
          <p>${d.desc}</p>
          <div class="dim-poles">${d.poles}</div>
        </div>`).join('')}
    </div>
  </section>

  <section class="section wrap section-divider">
    <div class="section-head">
      <span class="eyebrow">All 16 Types</span>
      <h2>Find yourself in the gallery</h2>
      <p class="section-sub">Every profile is written from first principles — cognitive style, strengths, growth edges, and career affinity.</p>
    </div>
    <div class="types-grid">${typeCards}</div>
  </section>

  <section class="section wrap section-divider">
    <div class="cta-card glass">
      <h2>Fifteen minutes. Zero fluff.</h2>
      <p>Your answers autosave locally as you go — close the tab and pick up where you left off.</p>
      <button class="btn btn-primary" data-route="assessment">Start Now →</button>
    </div>
  </section>
  `;
}

/* =========================================================================
   ASSESSMENT
   ========================================================================= */
function renderAssessment(){
  if(state.qIndex >= state.queue.length){
    return renderAssessmentComplete();
  }
  const q = state.queue[state.qIndex];
  const text = q.type==='bf' ? bigFiveItems[q.idx][3] : dichotomyItems[q.idx][1];
  const answeredKey = q.type+'-'+q.idx;
  const current = state.answers[answeredKey];
  const pct = Math.round((state.qIndex/state.queue.length)*100);
  const labels = ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'];

  return `
  <div class="assess-wrap">
    <div class="progress-shell">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${state.qIndex+1} / ${state.queue.length}</div>
    </div>
    <div class="module-label">${q.module}</div>
    <div class="q-card">
      <div class="q-text">${text}</div>
      <div class="likert" id="likert">
        ${[1,2,3,4,5].map(v=>`
          <button class="likert-opt ${current===v?'selected':''}" data-value="${v}">
            <span class="dot"></span>
            <span>${labels[v-1]}</span>
          </button>`).join('')}
      </div>
    </div>
    <div class="assess-nav">
      <button class="btn btn-ghost" id="q-back" ${state.qIndex===0?'disabled':''}>← Back</button>
      <button class="btn btn-primary" id="q-next" ${current==null?'disabled':''}>${state.qIndex===state.queue.length-1 ? 'See Results →' : 'Next →'}</button>
    </div>
    <div class="assess-meta">Your responses are stored only on this device, never transmitted.</div>
  </div>`;
}

function renderAssessmentComplete(){
  return `
  <div class="assess-wrap" style="text-align:center; padding-top:120px;">
    <div class="eyebrow" style="justify-content:center;">Assessment Complete</div>
    <h2 style="font-family:var(--serif); font-size:34px; margin-bottom:16px;">Calculating your profile…</h2>
    <p style="color:var(--ink-dim); margin-bottom:30px;">Crunching 100 responses across 5 traits, 30 facets, and 4 dichotomy scales.</p>
    <button class="btn btn-primary" data-route="results">View My Results →</button>
  </div>`;
}

function bindAssessment(){
  const likert = document.getElementById('likert');
  if(likert){
    likert.querySelectorAll('.likert-opt').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const q = state.queue[state.qIndex];
        const key = q.type+'-'+q.idx;
        state.answers[key] = parseInt(btn.dataset.value,10);
        persistState();
        document.getElementById('q-next').disabled = false;
        likert.querySelectorAll('.likert-opt').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        // auto-advance after brief delay for flow
        setTimeout(()=>{
          if(state.qIndex < state.queue.length-1){
            state.qIndex++; persistState(); render();
          } else {
            state.qIndex++; persistState();
            addXP(500);
            state.currentResult = scoreAssessment();
            saveToHistory(state.currentResult);
            navigate('results');
          }
        }, 280);
      });
    });
  }
  const back = document.getElementById('q-back');
  if(back) back.addEventListener('click', ()=>{ if(state.qIndex>0){ state.qIndex--; persistState(); render(); }});
  const next = document.getElementById('q-next');
  if(next) next.addEventListener('click', ()=>{
    if(state.qIndex < state.queue.length-1){ state.qIndex++; persistState(); render(); }
    else {
      state.qIndex++; persistState(); addXP(500);
      state.currentResult = scoreAssessment();
      saveToHistory(state.currentResult);
      navigate('results');
    }
  });
}

/* =========================================================================
   RESULTS
   ========================================================================= */
function renderResults(){
  const result = state.currentResult || scoreAssessment();
  state.currentResult = result;
  const t = TYPES[result.type];
  if(!t || Object.values(state.answers).length < 20){
    return `<div class="assess-wrap" style="text-align:center; padding-top:100px;">
      <h2 style="font-family:var(--serif); font-size:30px; margin-bottom:16px;">No results yet</h2>
      <p style="color:var(--ink-dim); margin-bottom:26px;">Take the assessment first to generate your profile.</p>
      <button class="btn btn-primary" data-route="assessment">Start Assessment →</button>
    </div>`;
  }

  const traitRows = Object.keys(TRAIT_NAMES).map(k=>`
    <div class="trait-row">
      <div class="trait-row-head"><b>${TRAIT_NAMES[k]}</b><span>${result.traits[k]}/100</span></div>
      <div class="trait-bar"><div class="trait-bar-fill" style="width:${result.traits[k]}%; background:${TRAIT_COLOR[k]}"></div></div>
    </div>`).join('');

  const dichRows = Object.entries(DICHOTOMY_META).map(([key,meta])=>{
    const score = result.dichotomy[key];
    return `
    <div class="dichotomy-row">
      <div class="dichotomy-labels"><b>${meta.labels[0]}</b><b>${meta.labels[1]}</b></div>
      <div class="dichotomy-track"><div class="dichotomy-marker" style="left:${score}%"></div></div>
    </div>`;
  }).join('');

  const facetBlocks = Object.keys(BIG_FIVE_FACETS).map(trait=>`
    <div class="facet-group">
      <div class="facet-group-title">${TRAIT_NAMES[trait]}</div>
      ${BIG_FIVE_FACETS[trait].map((f,i)=>`
        <div class="facet-item">
          <span>${f}</span>
          <div class="mini-bar"><div style="width:${result.facets[trait][i]}%; background:${TRAIT_COLOR[trait]}"></div></div>
          <div class="val">${result.facets[trait][i]}</div>
        </div>`).join('')}
    </div>`).join('');

  return `
  <div class="results-hero wrap">
    <div class="eyebrow" style="justify-content:center;">Your Cognitive Blueprint</div>
    <div class="type-reveal-code">${result.type}</div>
    <div class="type-reveal-name">${t.name}</div>
    <p class="type-reveal-tag">${t.ess}</p>
  </div>

  <div class="wrap">
    <div class="panel-grid">
      <div class="panel">
        <h3>Trait Radar</h3>
        <canvas id="radar-canvas" width="400" height="400"></canvas>
        <div style="margin-top:24px;">${traitRows}</div>
      </div>
      <div class="panel">
        <h3>Typology Dichotomies</h3>
        <p style="font-size:12.5px; color:var(--ink-faint); margin-bottom:22px;">Derived from a 50/50 blend of your Big Five scores and dedicated dichotomy items.</p>
        ${dichRows}
        <div style="margin-top:26px; padding-top:20px; border-top:1px solid var(--line);">
          <h3 style="font-size:15px; margin-bottom:10px;">In Their Own Words</h3>
          <p style="font-size:13.5px; color:var(--ink-dim); line-height:1.75;">${t.desc}</p>
        </div>
      </div>
    </div>

    <div class="panel-grid" style="margin-top:24px;">
      <div class="panel two-col" style="grid-column:1/-1; display:grid;">
        <div>
          <h3>Strengths</h3>
          <ul class="list-clean">${t.strengths.map(s=>`<li>${s}</li>`).join('')}</ul>
        </div>
        <div>
          <h3>Growth Edges</h3>
          <ul class="list-clean">${t.growth.map(s=>`<li>${s}</li>`).join('')}</ul>
        </div>
      </div>
    </div>

    <div class="panel-grid" style="margin-top:24px; grid-template-columns:1fr;">
      <div class="panel">
        <h3>Facet-Level Breakdown</h3>
        <p style="font-size:12.5px; color:var(--ink-faint); margin-bottom:20px;">The 30 sub-traits that compose your five core scores — this is the resolution most tests skip.</p>
        <div style="columns:2; column-gap:40px;">${facetBlocks}</div>
      </div>
    </div>

    <div class="panel-grid" style="margin-top:24px;">
      <div class="panel">
        <h3>Career Affinities</h3>
        <div class="tag-row">${t.careers.map(c=>`<span class="tag">${c}</span>`).join('')}</div>
      </div>
      <div class="panel">
        <h3>How to Communicate With ${result.type}s</h3>
        <p style="font-size:13.5px; color:var(--ink-dim); line-height:1.75;">${t.comm}</p>
      </div>
    </div>

    <div class="results-actions">
      <button class="btn btn-ghost" data-route="compatibility">Check Compatibility →</button>
      <button class="btn btn-ghost" data-route="attachment">Attachment Style Module →</button>
      <button class="btn btn-primary" id="retake-btn">Retake Assessment</button>
    </div>
  </div>`;
}

function drawRadar(traits){
  const canvas = document.getElementById('radar-canvas');
  if(!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const size = 400;
  canvas.width = size*dpr; canvas.height = size*dpr;
  canvas.style.width = size+'px'; canvas.style.height = size+'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const cx=size/2, cy=size/2, R=140;
  const keys = ['O','C','E','A','N'];
  const n = keys.length;
  const angle = (i)=> -Math.PI/2 + i*(2*Math.PI/n);

  ctx.clearRect(0,0,size,size);
  // rings
  ctx.strokeStyle = 'rgba(244,241,234,0.08)';
  for(let ring=1; ring<=4; ring++){
    ctx.beginPath();
    for(let i=0;i<=n;i++){
      const a = angle(i%n); const r = R*(ring/4);
      const x = cx+r*Math.cos(a), y = cy+r*Math.sin(a);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // spokes + labels
  ctx.font = '11px Inter, sans-serif';
  keys.forEach((k,i)=>{
    const a = angle(i);
    const x2 = cx+R*Math.cos(a), y2 = cy+R*Math.sin(a);
    ctx.strokeStyle = 'rgba(244,241,234,0.1)';
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x2,y2); ctx.stroke();
    const lx = cx+(R+26)*Math.cos(a), ly = cy+(R+26)*Math.sin(a);
    ctx.fillStyle = '#b9b6c9';
    ctx.textAlign = 'center'; ctx.textBaseline='middle';
    ctx.fillText(k, lx, ly);
  });
  // data polygon
  ctx.beginPath();
  keys.forEach((k,i)=>{
    const a = angle(i); const r = R*(traits[k]/100);
    const x = cx+r*Math.cos(a), y = cy+r*Math.sin(a);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  const grad = ctx.createLinearGradient(0,0,size,size);
  grad.addColorStop(0,'rgba(232,201,138,0.35)');
  grad.addColorStop(1,'rgba(139,127,240,0.35)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#e8c98a';
  ctx.lineWidth = 2;
  ctx.stroke();
  // dots
  keys.forEach((k,i)=>{
    const a = angle(i); const r = R*(traits[k]/100);
    const x = cx+r*Math.cos(a), y = cy+r*Math.sin(a);
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle = '#e8c98a'; ctx.fill();
  });
}

function bindResults(){
  const result = state.currentResult || scoreAssessment();
  drawRadar(result.traits);
  const retake = document.getElementById('retake-btn');
  if(retake) retake.addEventListener('click', ()=>{
    if(confirm('This clears your current answers and starts a fresh assessment. Continue?')){
      state.answers = {}; state.qIndex = 0; persistState();
      navigate('assessment');
    }
  });
}

/* =========================================================================
   TYPES LIBRARY
   ========================================================================= */
function renderTypes(){
  const groups = [
    {title:'Analysts', codes:['INTJ','INTP','ENTJ','ENTP']},
    {title:'Diplomats', codes:['INFJ','INFP','ENFJ','ENFP']},
    {title:'Sentinels', codes:['ISTJ','ISFJ','ESTJ','ESFJ']},
    {title:'Explorers', codes:['ISTP','ISFP','ESTP','ESFP']},
  ];
  return `
  <div class="wrap" style="padding-top:60px;">
    <div class="section-head">
      <span class="eyebrow">The 16 Types</span>
      <h2>Every cognitive style, mapped</h2>
      <p class="section-sub">Grouped by the classic four temperaments. Click any card to expand the full profile.</p>
    </div>
    ${groups.map(g=>`
      <div style="margin-bottom:50px;">
        <h3 style="font-family:var(--serif); font-size:20px; margin-bottom:18px; color:var(--gold-bright);">${g.title}</h3>
        <div class="types-grid">
          ${g.codes.map(code=>{
            const t = TYPES[code];
            return `<div class="type-card" data-type-expand="${code}">
              <div class="code">${code}</div>
              <h4>${t.name}</h4>
              <p>${t.ess}</p>
            </div>`;
          }).join('')}
        </div>
      </div>`).join('')}
  </div>
  <div id="type-modal-backdrop" style="display:none; position:fixed; inset:0; z-index:100; background:rgba(5,5,10,0.75); backdrop-filter:blur(6px); align-items:center; justify-content:center; padding:20px;">
    <div id="type-modal" class="glass" style="max-width:640px; width:100%; max-height:85vh; overflow-y:auto; padding:40px; position:relative;"></div>
  </div>`;
}

function typeModalContent(code){
  const t = TYPES[code];
  return `
    <button id="modal-close" class="icon-btn" style="position:absolute; top:20px; right:20px;">✕</button>
    <div class="eyebrow">${code}</div>
    <h2 style="font-family:var(--serif); font-size:30px; margin-bottom:6px;">${t.name}</h2>
    <p style="color:var(--gold-bright); font-size:13.5px; margin-bottom:20px;">${t.ess}</p>
    <p style="font-size:14px; color:var(--ink-dim); line-height:1.8; margin-bottom:26px;">${t.desc}</p>
    <div class="two-col">
      <div>
        <h3 style="font-size:15px; margin-bottom:10px;">Strengths</h3>
        <ul class="list-clean">${t.strengths.map(s=>`<li>${s}</li>`).join('')}</ul>
      </div>
      <div>
        <h3 style="font-size:15px; margin-bottom:10px;">Growth Edges</h3>
        <ul class="list-clean">${t.growth.map(s=>`<li>${s}</li>`).join('')}</ul>
      </div>
    </div>
    <h3 style="font-size:15px; margin:22px 0 10px;">Career Affinities</h3>
    <div class="tag-row">${t.careers.map(c=>`<span class="tag">${c}</span>`).join('')}</div>
    <h3 style="font-size:15px; margin:22px 0 10px;">Communication Tip</h3>
    <p style="font-size:13.5px; color:var(--ink-dim); line-height:1.75;">${t.comm}</p>
  `;
}

function bindTypeCards(){
  const backdrop = document.getElementById('type-modal-backdrop');
  const modal = document.getElementById('type-modal');
  document.querySelectorAll('[data-type-expand]').forEach(card=>{
    card.addEventListener('click', ()=>{
      modal.innerHTML = typeModalContent(card.dataset.typeExpand);
      backdrop.style.display='flex';
      document.getElementById('modal-close').addEventListener('click', ()=> backdrop.style.display='none');
    });
  });
  backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) backdrop.style.display='none'; });
}

/* =========================================================================
   RESEARCH / METHODOLOGY
   ========================================================================= */
function renderResearch(){
  const cards = [
    {h:'The Five-Factor Model', p:"The empirical backbone of this platform. Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism form the trait structure with the strongest cross-cultural, longitudinal replication in personality science — it predicts real-world outcomes (job performance, relationship stability, health) better than any typology alone.", src:'Costa & McCrae · NEO-PI-R facet structure; Goldberg · IPIP'},
    {h:'The Typology Overlay', p:"Jungian-derived types (the familiar 16-letter codes) are popular but weaker on test-retest reliability than the Big Five. Rather than discard them, this platform grounds each dichotomy in documented Big Five correlations, then adds a dedicated scale per dichotomy to recover the resolution a pure Big Five mapping would lose.", src:'McCrae & Costa (1989), Journal of Personality'},
    {h:'Adult Attachment Theory', p:"Attachment style — how you relate to closeness and independence — is one of the better-replicated frameworks in relationship psychology. This platform uses the four-category adult model built on Bowlby's original attachment theory.", src:"Bowlby (1969); Bartholomew & Horowitz (1991)"},
    {h:'Facet-Level Scoring', p:"Each Big Five trait is scored from 6 underlying facets (30 total), following the structure popularized by the NEO-PI-R and its public-domain IPIP proxy items. Two people can share an 'Extraversion' score while differing sharply on Assertiveness vs. Gregariousness — the facet layer is where that shows up.", src:'Costa & McCrae (1992); Goldberg (1999)'},
    {h:'Reverse-Keyed Items', p:'Half of the Big Five items in this assessment are reverse-worded and reverse-scored. This is standard psychometric practice to reduce acquiescence bias — the tendency to agree with statements regardless of content.', src:'Standard psychometric practice, per APA testing guidelines'},
    {h:'What This Is Not', p:"This is a self-reflection tool, not a diagnostic or clinical instrument. No online instrument — including this one — replaces a licensed psychologist for mental health, legal, or employment decisions. Treat your result as a well-organized mirror, not a verdict.", src:'Platform disclosure'},
  ];
  return `
  <div class="wrap" style="padding-top:60px; padding-bottom:60px;">
    <div class="section-head">
      <span class="eyebrow">Methodology</span>
      <h2>Built on published research, not vibes</h2>
      <p class="section-sub">Every scale in this platform traces back to a named model in the personality psychology literature. Here's exactly how your result gets calculated.</p>
    </div>
    <div class="research-grid">
      ${cards.map(c=>`
        <div class="research-card">
          <h4>${c.h}</h4>
          <p>${c.p}</p>
          <div class="src">${c.src}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* =========================================================================
   COMPATIBILITY
   ========================================================================= */
function compatibilityReport(a,b){
  const dims = ['EI','SN','TF','JP'];
  let shared = 0;
  const lines = [];
  const templates = {
    EI:{same:"You both draw and spend energy the same way — expect an intuitive rhythm around how much social time feels right.",
        diff:"One of you recharges around people, the other in solitude. Name this early: alone-time isn't rejection, and social plans aren't an imposition."},
    SN:{same:"You process information the same way — conversations move fast because you're not translating between concrete and abstract by default.",
        diff:"One of you starts with facts and details, the other with patterns and possibility. Great for balance, but plan for a translation step in big decisions."},
    TF:{same:"You weigh decisions on the same basis — you'll rarely feel like the other person is being 'too cold' or 'too soft' about the same call.",
        diff:"One of you leads with logic, the other with impact-on-people. This is a classic complementary pairing — powerful in decisions, but requires explicit patience for the other's process."},
    JP:{same:"You share a similar relationship with structure — plans, or the lack of them, won't be a recurring source of friction.",
        diff:"One of you wants a plan locked in, the other wants to keep options open. Negotiate this explicitly around trips, deadlines, and shared commitments."},
  };
  dims.forEach(d=>{
    const same = a[dims.indexOf(d)]===b[dims.indexOf(d)];
    if(same) shared++;
    lines.push(templates[d][same?'same':'diff']);
  });
  const score = 58 + shared*10; // 58-98 illustrative range
  return {score, lines};
}

function renderCompatibility(){
  const codes = Object.keys(TYPES);
  const mine = state.currentResult ? state.currentResult.type : null;
  return `
  <div class="wrap" style="padding-top:60px; padding-bottom:60px;">
    <div class="section-head">
      <span class="eyebrow">Compatibility Lens</span>
      <h2>How two types actually interact</h2>
      <p class="section-sub">Illustrative, not deterministic — a lens for a conversation, not a verdict on the relationship. Pick two types below.</p>
    </div>
    <div class="compat-pickers">
      <div class="select-shell">
        <select id="compat-a">${codes.map(c=>`<option value="${c}" ${c===mine?'selected':''}>${c} — ${TYPES[c].name}</option>`).join('')}</select>
      </div>
      <div class="vs">×</div>
      <div class="select-shell">
        <select id="compat-b">${codes.map(c=>`<option value="${c}" ${c===(mine==='INTJ'?'ENFP':'INTJ')?'selected':''}>${c} — ${TYPES[c].name}</option>`).join('')}</select>
      </div>
    </div>
    <div id="compat-output"></div>
  </div>`;
}

function renderCompatOutput(codeA, codeB){
  const dims = ['EI','SN','TF','JP'];
  const lettersA = codeA.split(''), lettersB = codeB.split('');
  const report = compatibilityReport(lettersA, lettersB);
  const circumference = 2*Math.PI*60;
  const offset = circumference - (report.score/100)*circumference;
  return `
  <div class="panel" style="margin-top:10px;">
    <div class="compat-score-ring">
      <svg width="150" height="150">
        <circle cx="75" cy="75" r="60" stroke="rgba(244,241,234,0.1)" stroke-width="10" fill="none"/>
        <circle cx="75" cy="75" r="60" stroke="url(#g)" stroke-width="10" fill="none"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8c98a"/><stop offset="100%" stop-color="#8b7ff0"/>
        </linearGradient></defs>
      </svg>
      <div class="compat-score-num">${report.score}</div>
    </div>
    <p style="text-align:center; font-family:var(--mono); font-size:11px; color:var(--ink-faint); text-transform:uppercase; margin-bottom:30px;">
      ${codeA} × ${codeB} · Rapport Index
    </p>
    <div class="two-col">
      ${dims.map((d,i)=>`
        <div style="margin-bottom:18px;">
          <div style="font-family:var(--mono); font-size:11px; color:var(--gold); margin-bottom:6px; text-transform:uppercase;">${DICHOTOMY_META[d].labels.join(' / ')}</div>
          <p style="font-size:13px; color:var(--ink-dim); line-height:1.65;">${report.lines[i]}</p>
        </div>`).join('')}
    </div>
  </div>`;
}

function bindCompatibility(){
  const a = document.getElementById('compat-a'), b = document.getElementById('compat-b');
  const out = document.getElementById('compat-output');
  function update(){ out.innerHTML = renderCompatOutput(a.value, b.value); }
  a.addEventListener('change', update); b.addEventListener('change', update);
  update();
}

/* =========================================================================
   ATTACHMENT MODULE
   ========================================================================= */
function renderAttachment(){
  return `
  <div class="wrap" style="padding-top:70px; padding-bottom:80px; max-width:720px;">
    <div class="eyebrow">Bonus Module</div>
    <h2 style="font-family:var(--serif); font-size:36px; margin-bottom:18px;">Your Relational Blueprint</h2>
    <p style="color:var(--ink-dim); font-size:15px; line-height:1.75; margin-bottom:30px;">
      Twelve questions, grounded in adult attachment theory, on how you actually behave in close relationships —
      not who you'd like to be, but who shows up when things get close.
    </p>
    <button class="btn btn-primary" data-route="attachment-quiz">Take the Attachment Quiz →</button>
  </div>`;
}

function renderAttachmentQuiz(){
  const i = state.attachQIndex;
  if(i >= attachmentItems.length) return renderAttachmentScoring();
  const [,text] = attachmentItems[i];
  const current = state.attachAnswers[i];
  const pct = Math.round((i/attachmentItems.length)*100);
  const labels = ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'];
  return `
  <div class="assess-wrap">
    <div class="progress-shell">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${i+1} / ${attachmentItems.length}</div>
    </div>
    <div class="module-label">Relational Blueprint · Attachment Style</div>
    <div class="q-card">
      <div class="q-text">${text}</div>
      <div class="likert" id="a-likert">
        ${[1,2,3,4,5].map(v=>`
          <button class="likert-opt ${current===v?'selected':''}" data-value="${v}">
            <span class="dot"></span><span>${labels[v-1]}</span>
          </button>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderAttachmentScoring(){
  return `<div class="assess-wrap" style="text-align:center; padding-top:100px;">
    <button class="btn btn-primary" data-route="attachment-result">View My Attachment Style →</button>
  </div>`;
}

function renderAttachmentResult(){
  const result = scoreAttachment();
  const p = attachmentProfiles[result.style];
  const maxScore = 5;
  return `
  <div class="wrap" style="padding-top:70px; padding-bottom:80px; max-width:720px;">
    <div class="eyebrow">Your Relational Blueprint</div>
    <div class="attach-result-badge">${p.name}</div>
    <h2 style="font-family:var(--serif); font-size:30px; margin-bottom:6px;">${p.tag}</h2>
    <p style="color:var(--ink-dim); font-size:14.5px; line-height:1.8; margin:18px 0 30px;">${p.desc}</p>
    <div class="panel">
      <h3>Core Traits</h3>
      <ul class="list-clean">${p.traits.map(t=>`<li>${t}</li>`).join('')}</ul>
    </div>
    <div class="panel" style="margin-top:20px;">
      <h3>Score Spread</h3>
      ${Object.entries(result.scores).map(([style,score])=>`
        <div class="trait-row">
          <div class="trait-row-head"><b>${attachmentProfiles[style].name}</b><span>${(score/maxScore*100).toFixed(0)}%</span></div>
          <div class="trait-bar"><div class="trait-bar-fill" style="width:${score/maxScore*100}%; background:var(--gold)"></div></div>
        </div>`).join('')}
    </div>
    <div style="text-align:center; margin-top:36px;">
      <button class="btn btn-ghost" data-route="landing">Back to Home</button>
    </div>
  </div>`;
}

function bindAttachmentQuiz(){
  const likert = document.getElementById('a-likert');
  if(!likert) return;
  likert.querySelectorAll('.likert-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = state.attachQIndex;
      state.attachAnswers[i] = parseInt(btn.dataset.value,10);
      setTimeout(()=>{ state.attachQIndex++; render(); }, 260);
    });
  });
}

/* =========================================================================
   HISTORY
   ========================================================================= */
function renderHistory(){
  const hist = getHistory();
  if(!hist.length){
    return `<div class="wrap"><div class="empty-state">
      <div class="glyph">◐</div>
      <p>No assessments yet. Your results will be saved here after your first run.</p>
      <div style="margin-top:20px;"><button class="btn btn-primary" data-route="assessment">Take the Assessment →</button></div>
    </div></div>`;
  }
  return `
  <div class="wrap" style="padding-top:60px; padding-bottom:60px; max-width:760px;">
    <div class="section-head">
      <span class="eyebrow">Your History</span>
      <h2>Past assessments</h2>
      <p class="section-sub">Personality is more stable than mood, but life stage and context still shift it. Track it over time.</p>
    </div>
    <div class="history-list">
      ${hist.map(h=>`
        <div class="history-item">
          <div>
            <div class="hcode">${h.type} <span style="font-size:14px; color:var(--ink-dim); font-family:var(--sans);">${TYPES[h.type]?TYPES[h.type].name:''}</span></div>
            <div class="hmeta">${new Date(h.date).toLocaleString()}</div>
          </div>
          <div class="hmeta">O ${h.traits.O} · C ${h.traits.C} · E ${h.traits.E} · A ${h.traits.A} · N ${h.traits.N}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* =========================================================================
   INIT
   ========================================================================= */
document.getElementById('theme-toggle').addEventListener('click', ()=>{
  const html = document.documentElement;
  const next = html.getAttribute('data-theme')==='dark' ? 'light':'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('theme-toggle').textContent = next==='dark' ? '☾' : '☀';
  try{ localStorage.setItem('ky_theme', next); }catch(e){}
});
document.getElementById('nav-toggle').addEventListener('click', ()=>{
  document.getElementById('nav').classList.toggle('open');
});

(function init(){
  try{
    const savedTheme = localStorage.getItem('ky_theme');
    if(savedTheme){
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.getElementById('theme-toggle').textContent = savedTheme==='dark' ? '☾':'☀';
    }
  }catch(e){}
  loadState();
  renderXP();
  const h = window.location.hash.replace('#','') || 'landing';
  state.route = h;
  render();
})();


/* =========================================================================
   SOCIAL / TELEGRAM QR
   ========================================================================= */
const TELEGRAM_QR_DATA_URI = "data:image/jpeg;base64,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/9H9/KKKKACiiigAooooAKKKKAP/0v38ooooAKKKKACiiigAooooA//T/fyiiigAooooAKKKKACiiigD/9T9/KKKKACiiigAooooAKKKKAP/1f38ooooAKKKKACiiigAooooA//W/fyiiigAooooAKKKKACiiigD/9f9/KKKKACiiigAooooAKKKKAP/0P38ooooAKKKG6GgBBkda4749/HTw5+zb8I9d8beLNQg0zQvD9q91czSMBwo4UerMeAPU1v+J/FeneCPDt5q2r3ttp2m2ETT3FzcOEjhRRksxPQYr+aD/g4C/wCC20/7e3jyb4b+ALua3+Fnh25PmTIxU67cKceYf+mYP3R+NaUabm7dDOc1FXPkn/gpn+3frn/BQ/8Aa18RfEDVpJYrGeU22kWZYlLK0Q4jQehI5PqSa+i/+CTP/Juetf8AYyT/APpLa1+eg46V+hn/AASZGP2c9a/7GSf/ANJbWvWjFJWOC+tz/9H8TCMHI6U+yvJdOu4p7eV4Z4WDxyIcMjA5BB7HNNLA966b4OfB3xB8fviLpvhPwvb2N5r2ryiG0gutSttPSZz0XzbiSOME+7Cvcueer30P2Q/4Ijf8HK0vgmLSvhb8ftQefSogttpXiiXLPbjosdwepX0av3i8HeNtK+IHhmz1jRNQs9U0y/jE1vc20okilQ8ggjiv5To/+DaX9thwGX4LhlYAgjxhoJBH/gbX2N/wTg/ZU/4Kff8ABObWIrXRfhXJ4h8HF18/QNS8Z6HJBtB58om+zGfpxXn1qNN+9GSOmE5LdH9ANJuArzX9nD4qePfiV4Pt5/H3wv1f4ca2EHn2txq2nahFuxzte1uJMjPqBXpIBHb9a49jcdRSZPpS0Af/0v38ooooAKKKKACiiigAooooA//T/fyiiigAooooAKKKKACiiigD/9T9/KKKKACiiigAooooAKKKKAP/1f38ooooAKKKKACiiigAooooA//W/fyiiigAooooAKKKKACiiigD/9f9/KKKKACiiigAooooAKKKKAP/0P38ooooAKKKKACiiigAooooA//R/fyiiigAooooAKKKKACiiigD/9L9/KKKKACiiigAooooAKKKKAP/0/38ooooAKKKKACiiigAooooA//U/fyiiigAooooAKKKKACiiigD/9X9/KKKKACiiigAooooAKKKKAP/1v38opOc0hz1I/AGkA48VxHx5/aI8H/sy/DnUPFfjfXrDQNE06JpZJ7mQKWwOijqxPoK85/bK+Onxs+HHhSaH4P/AAR1L4ja7KhEU8+v6Vp1nA2OCwnukdvoF/Gvw2/bk/4Jlf8ABTD/AIKDeNn1f4g/Dm6ubVHZrXS4PGWhR2VmpPCqgvsH6nmtadO/xMznNrZHH/8ABbH/AIOAdf8A29dQu/Afw7lvfDvwvgcpM24pca4QfvSY6R+i9+9fmWgwoHXFfbXib/g3Q/bF8EeHrzVtX+Edtpum2ETT3NzceMtAjjhRRksxN7wAK+L9V0uXRNUubOcwme0kaKTypkmTcDg4dCVYe6kg16dJRStFnFNyerIFGTX6Gf8ABJsY/Z01r/sY5/8A0lta/PRSBX6F/wDBJw5/Z01r/sY5/wD0lta1IP/ZAAChDREAAABDYXB0dXJlZF9BcHBfSW5mb2V5SmpiMjF3SWpvaVkyOXRMbk5sWXk1aGJtUnliMmxrTG1kaGJHeGxjbmt6WkZ3dlkyOXRMbk5oYlhOMWJtY3VZVzVrY205cFpDNW5ZV3hzWlhKNUxtRndjQzVoWTNScGRtbDBlUzVIWVd4c1pYSjVRV04wYVhacGRIa2lmUT09AABRDBQAAABTYW1zdW5nX0NhcHR1cmVfSW5mb1NjcmVlbnNob3QAAKELGAAAAFBob3RvRWRpdG9yX1JlX0VkaXRfRGF0YXsib3JpZ2luYWxQYXRoIjoiXC9kYXRhXC9zZWNcL3Bob3RvZWRpdG9yXC8wXC9hZGY4ZjM2YTcyMDc1NzBhN2YyM2EzNDg3Mzg5MWMyMTk4MDQyMTA5MGIxMTg2Y2U4ZTkzYzM3ZDZjNmE4YzJkXzM1OTc1NS5qcGciLCJyZXByZXNlbnRhdGl2ZUZyYW1lTG9jIjotMSwic3RhcnRNb3Rpb25WaWRlbyI6LTEsImVuZE1vdGlvblZpZGVvIjotMSwiaXNNb3Rpb25WaWRlb011dGUiOmZhbHNlLCJpc1RyaW1Nb3Rpb25WaWRlbyI6ZmFsc2UsImNsaXBJbmZvVmFsdWUiOiJ7XCJtQ2VudGVyWFwiOjAuNDcyMjI0NzQyMTc0MTQ4NTYsXCJtQ2VudGVyWVwiOjAuMzU5MDk5Mzg4MTIyNTU4NixcIm1XaWR0aFwiOjAuODI1MjQ0NjY1MTQ1ODc0LFwibUhlaWdodFwiOjAuMzgyMDA4NzMxMzY1MjAzODYsXCJtUm90YXRpb25cIjowLFwibVJvdGF0ZVwiOjAsXCJtSEZsaXBcIjowLFwibVZGbGlwXCI6MCxcIm1Sb3RhdGlvbkVmZmVjdFwiOjAsXCJtUm90YXRlRWZmZWN0XCI6MCxcIm1IRmxpcEVmZmVjdFwiOjAsXCJtVkZsaXBFZmZlY3RcIjowLFwibUhvelBlcnNwZWN0aXZlXCI6MCxcIm1WZXJQZXJzcGVjdGl2ZVwiOjB9IiwidG9uZVZhbHVlIjoie1wiYnJpZ2h0bmVzc1wiOjEwMCxcImV4cG9zdXJlXCI6MTAwLFwiY29udHJhc3RcIjoxMDAsXCJzYXR1cmF0aW9uXCI6MTAwLFwiaHVlXCI6MTAwLFwid2JNb2RlXCI6LTEsXCJ3YlRlbXBlcmF0dXJlXCI6MTAwLFwidGludFwiOjEwMCxcInNoYWRvd1wiOjEwMCxcImhpZ2hsaWdodFwiOjEwMCxcImxpZ2h0YmFsYW5jZVwiOjEwMCxcInNoYXJwbmVzc1wiOjEwMCxcImRlZmluaXRpb25cIjoxMDAsXCJpc0JyaWdodG5lc3NJUEVcIjpmYWxzZSxcImlzRXhwb3N1cmVJUEVcIjpmYWxzZSxcImlzQ29udHJhc3RJUEVcIjpmYWxzZSxcImlzU2F0dXJhdGlvbklQRVwiOmZhbHNlfSIsImVmZmVjdFZhbHVlIjoie1wiZmlsdGVySW5kaWNhdGlvblwiOjQwOTcsXCJhbHBoYVZhbHVlXCI6MTAwLFwiZmlsdGVyVHlwZVwiOjB9IiwicG9ydHJhaXRFZmZlY3RWYWx1ZSI6IntcImVmZmVjdElkXCI6LTEsXCJlZmZlY3RMZXZlbFwiOi0xLFwiZXhpZlJvdGF0aW9uXCI6MCxcImxpZ2h0TGV2ZWxcIjowLFwidG91Y2hYXCI6MCxcInRvdWNoWVwiOjAsXCJyZWZvY3VzWFwiOi0xLFwicmVmb2N1c1lcIjotMSxcImVmZmVjdElkT3JpZ2luYWxcIjotMSxcImVmZmVjdExldmVsT3JpZ2luYWxcIjotMSxcImxpZ2h0TGV2ZWxPcmlnaW5hbFwiOi0xLFwidG91Y2hYT3JpZ2luYWxcIjowLFwidG91Y2hZT3JpZ2luYWxcIjowLFwicmVmb2N1c1hPcmlnaW5hbFwiOi0xLFwicmVmb2N1c1lPcmlnaW5hbFwiOi0xLFwid2F0ZXJNYXJrUmVtb3ZlZFwiOmZhbHNlLFwid2F0ZXJNYXJrUmVtb3ZlZE9yaWdpbmFsXCI6ZmFsc2V9IiwiaXNCbGVuZGluZyI6dHJ1ZSwiaXNOb3RSZUVkaXQiOmZhbHNlLCJzZXBWZXJzaW9uIjoiMTcwMDAwIiwibmRlVmVyc2lvbiI6MSwicmVTaXplIjo0LCJpc1NjYWxlQUkiOmZhbHNlLCJyb3RhdGlvbiI6MSwiYWRqdXN0bWVudFZhbHVlIjoie1wibUNyb3BTdGF0ZVwiOjEzMTA3Nn0iLCJpc0FwcGx5U2hhcGVDb3JyZWN0aW9uIjpmYWxzZSwiaXNOZXdSZUVkaXRPbmx5IjpmYWxzZSwiaXNEZWNvUmVFZGl0T25seSI6ZmFsc2UsImlzQUlGaWx0ZXJSZUVkaXRPbmx5IjpmYWxzZX0AAKELFgAAAE9yaWdpbmFsX1BhdGhfSGFzaF9LZXk4YjM1Zjk3MTYyODBlZjYxYjVlZmNjZmM3YzkwMzVmOTgzYjkzYzRmY2FlN2E5MjY0OGExODAyYTgyYTI2NWJlLzM1OTc1NVNFRkhrAAAABAAAAAAAoQ2xBwAAmQAAAAAAUQwYBwAAJgAAAAAAoQvyBgAAjQYAAAAAoQtlAAAAZQAAADwAAABTRUZU";

(function initSocial(){
  const img = document.getElementById("qr-image");
  if(img) img.src = TELEGRAM_QR_DATA_URI;
  const toggleBtn = document.getElementById("telegram-toggle");
  const popover = document.getElementById("qr-popover");
  if(toggleBtn && popover){
    toggleBtn.addEventListener("click", (e)=>{
      e.stopPropagation();
      popover.classList.toggle("open");
    });
    document.addEventListener("click", (e)=>{
      if(!popover.contains(e.target) && e.target!==toggleBtn){
        popover.classList.remove("open");
      }
    });
  }
})();
