window.ACADEMY_DATA = window.ACADEMY_DATA || {quizzes:{}, flashcards:{}, exams:{}};
Object.assign(window.ACADEMY_DATA.quizzes, {
"greek:1": [
{"q":"Which Greek letter is transliterated 'th' and sounds like the 'th' in 'thin'?","choices":["τ (tau)","θ (theta)","φ (phi)","χ (chi)"],"answer":1,"explain":"θῆτα (theta) is the 'th' in 'thin'. τ is a plain 't', φ is 'ph' as in 'phone', χ is the guttural 'ch' in 'Bach'."},
{"q":"What is special about the letter sigma?","choices":["It is never written at the end of a word","It has two lowercase forms: σ inside a word, ς at the end","It is silent before vowels","It changes its sound after rho"],"answer":1,"explain":"σ appears word-initially and medially; ς is the word-final form, as in λόγος. Same letter, same sound — the shape marks the word's edge."},
{"q":"In the Erasmian (classroom) pronunciation, how does η (eta) sound?","choices":["like 'ee' in 'machine'","like 'i' in 'pin'","like 'a' in 'fate'","like 'o' in 'note'"],"answer":2,"explain":"Erasmian η is a long 'a' as in 'fate' — distinct from ε (short 'e' in 'met'). Note this differs from modern Greek, where η sounds like 'ee'."}
],
"greek:2": [
{"q":"The word ἁρμονία begins with a rough breathing. How do you pronounce it?","choices":["'armonia' — the mark is silent","'harmonia' — the mark adds an 'h'","'kharmonia' — the mark hardens the vowel","with a glottal stop before the 'a'"],"answer":1,"explain":"The rough breathing (῾) adds an 'h' to an initial vowel. The smooth breathing (ι) adds nothing."},
{"q":"Which diphthong sounds like the 'oi' in 'oil'?","choices":["αι","ει","οι","ου"],"answer":2,"explain":"οι = 'oi' in 'oil'. αι = 'ai' in 'aisle', ει = 'ei' in 'eight', ου = 'oo' in 'boot'."},
{"q":"Where can the circumflex accent stand?","choices":["on any of the last three syllables","only on the last syllable","on one of the last two syllables, over a long vowel or diphthong","only over short vowels"],"answer":2,"explain":"The circumflex (῀) is restricted to the last two syllables and can only sit on long vowels or diphthongs — as in δῶρον."}
],
"greek:3": [
{"q":"What is the genitive singular of λόγος?","choices":["λόγον","λόγου","λόγῳ","λόγοι"],"answer":1,"explain":"Second-declension masculine genitive singular ends in -ου: λόγου, 'of the word'. -ον is accusative, -ῳ dative, -οι nominative plural."},
{"q":"In a neuter noun like δῶρον, which two cases are always identical?","choices":["nominative and genitive","nominative and accusative","genitive and dative","accusative and vocative"],"answer":1,"explain":"The neuter rule: nominative = accusative (and vocative) in every number — τὸ δῶρον, τὰ δῶρα."},
{"q":"Translate: τοῦ νόμου.","choices":["the law (subject)","the law (object)","of the law","to the law"],"answer":2,"explain":"τοῦ is the masculine/neuter genitive singular article and νόμου is genitive singular: 'of the law'. The genitive marks possession or 'of'."}
],
"greek:4": [
{"q":"What is the 3rd person plural present active of λύω?","choices":["λύουσι(ν)","λύετε","λύομεν","λύει"],"answer":0,"explain":"λύ-ουσι(ν): the 3rd plural ending is -ουσι, with the movable nu often added — 'they loose / are loosing'."},
{"q":"Which form means 'you (singular) are'?","choices":["εἰμί","ἐσμέν","εἶ","εἰσίν"],"answer":2,"explain":"εἶ is 2nd singular of εἰμί. εἰμί = 'I am', ἐσμέν = 'we are', εἰσίν = 'they are'. εἰμί is irregular — memorize it whole."},
{"q":"Translate: οἱ φίλοι γράφουσιν.","choices":["The friend writes","The friends are writing","The friends wrote","Write, friends!"],"answer":1,"explain":"οἱ φίλοι is the nominative plural subject; γράφουσιν is 3rd plural present — 'the friends write / are writing'. The Greek present covers both English renderings."}
],
"greek:5": [
{"q":"What does κόσμος mean?","choices":["time","world, order","soul","war"],"answer":1,"explain":"κόσμος is both 'world' and 'order' — the Greeks saw the universe as an ordered whole. English 'cosmos' (and 'cosmetics', ordered adornment)."},
{"q":"The English word 'phobia' comes from which Greek word meaning 'fear'?","choices":["φίλος","φόβος","φωνή","φῶς"],"answer":1,"explain":"φόβος = fear, panic — hence phobia, claustrophobia. φίλος = friend, φωνή = sound/voice, φῶς = light."},
{"q":"What does the postpositive word γάρ signal?","choices":["a question","'for' — giving the reason","a command","negation"],"answer":1,"explain":"γάρ means 'for' in the sense of 'because': it gives the reason for what came before. Postpositive means it never stands first in its clause."}
],
"greek:6": [
{"q":"In the Anabasis opening, what does γίγνονται παῖδες δύο mean?","choices":["two sons fight","two sons are born","the two boys run","two children remain"],"answer":1,"explain":"γίγνονται (3rd plural of γίγνομαι) = 'are born'; παῖδες δύο = 'two sons'. The full line: 'To Darius and Parysatis are born two sons.'"},
{"q":"Translate: ὁ λόγος ἦν πρὸς τὸν θεόν.","choices":["The Word was with God","God was the Word","In the beginning was the Word","The Word heard God"],"answer":0,"explain":"ὁ λόγος = the Word (subject), ἦν = 'was' (past of εἰμί), πρὸς τὸν θεόν = 'toward/with God'. John 1:1b."},
{"q":"In καὶ θεὸς ἦν ὁ λόγος, why does θεός have no article?","choices":["a typo in the manuscripts","it is the predicate nominative — 'the Word was God'","it means 'a god' instead","Greek never uses the article with θεός"],"answer":1,"explain":"θεός is the predicate nominative describing the subject ὁ λόγος: 'and the Word was God.' The article marks the subject; its absence marks the predicate — Greek word order doing theology."}
]
});
Object.assign(window.ACADEMY_DATA.flashcards, {
"greek": [
{"front":"λόγος","back":"word, speech, reason, account — English: logic, dialogue, -logy"},
{"front":"ἄνθρωπος","back":"human being — English: anthropology (the study of humans)"},
{"front":"φιλία","back":"friendship, love — φιλοσοφία = 'love of wisdom'"},
{"front":"δημοκρατία","back":"democracy — δῆμος (people) + κράτος (rule): rule by the people"},
{"front":"ἀρετή","back":"excellence, virtue — the goal-word of Greek ethics: being good at being human"},
{"front":"ψυχή","back":"soul, life — English: psychology"},
{"front":"κόσμος","back":"world, order — the universe as an ordered whole; English: cosmos"},
{"front":"χρόνος","back":"time — English: chronicle, chronic, anachronism"},
{"front":"σοφία","back":"wisdom — English: sophisticated (once meant 'full of wisdom')"},
{"front":"δίκη","back":"justice, right — the order of what is right"}
]
});
Object.assign(window.ACADEMY_DATA.exams, {
"greek": [
{"q":"Which breathing mark adds an 'h' sound, and which word shows it?","choices":["smooth breathing — Ἀθήνη","rough breathing — Ἑλλάς","circumflex — δῶρον","grave — καί"],"answer":1,"explain":"The rough breathing (῾) adds 'h': Ἑλλάς = 'hellas'. The smooth breathing adds nothing."},
{"q":"Give the accusative plural of λόγος.","choices":["λόγοι","λόγους","λόγων","λόγοις"],"answer":1,"explain":"-ους is the 2nd-declension masculine accusative plural: λόγους."},
{"q":"Parse ἐσμέν.","choices":["1st plural of εἰμί — 'we are'","2nd plural of εἰμί — 'you are'","3rd plural of λύω — 'they loose'","1st singular of εἰμί — 'I am'"],"answer":0,"explain":"ἐσμέν is 1st person plural present of εἰμί: 'we are'. εἰμί is irregular — memorize it whole."},
{"q":"What case is ἀρχῇ in Ἐν ἀρχῇ, and why?","choices":["accusative — object of ἐν","genitive — 'of the beginning'","dative — ἐν takes the dative: 'in the beginning'","nominative — subject"],"answer":2,"explain":"ἐν governs the dative: ἀρχῇ is dative singular of ἀρχή — 'in the beginning'."},
{"q":"Which English word does NOT come from Greek?","choices":["telephone","biology","verdict","theater"],"answer":2,"explain":"Verdict is Latin (verum + dictum). Telephone (τῆλε + φωνή), biology (βίος + λόγος), and theater (θέατρον) are Greek."},
{"q":"Translate: ἔχω δῶρον.","choices":["I see the gift","I have a gift","The gift has me","Give the gift"],"answer":1,"explain":"ἔχω = 'I have' (1st singular present); δῶρον is accusative singular, the direct object — 'I have a gift'."},
{"q":"The iota in ᾳ (as in ἀρχῇ) is…","choices":["pronounced as a separate syllable","silent in the Erasmian pronunciation","pronounced like English 'y'","a breathing mark"],"answer":1,"explain":"Iota subscript marks a former diphthong; in Erasmian reading it is silent — ἀρχῇ sounds 'ar-KHAY'."},
{"q":"What does οὐκ signal before a vowel?","choices":["a question","emphatic 'yes'","the negative οὐ before a smooth vowel","a command"],"answer":2,"explain":"οὐ becomes οὐκ before a smooth vowel (οὐχ before a rough one) — euphony, not a new word."},
{"q":"In Δαρείου καὶ Παρυσάτιδος, what case are the names in?","choices":["nominative — they are the subjects","accusative — direct objects","genitive — 'of Darius and of Parysatis'","dative — indirect objects"],"answer":2,"explain":"-ου and -ιδος are genitive endings: '(of Darius and of Parysatis) two sons are born' — the genitive marks whose sons they are."},
{"q":"Which pair is a correct Greek-to-English match?","choices":["πόλεμος — peace","εἰρήνη — war","νόμος — law, custom","βίος — death"],"answer":2,"explain":"νόμος = law/custom (English '-nomy': astronomy, economy). πόλεμος = war, εἰρήνη = peace, βίος = life — θάνατος = death."}
]
});
