// Dialogues, Quests, and Interaction Trees for Festa a Monnaz

const DIALOGUES = {
  kri: {
    speaker: 'Kri',
    avatar: 'kri',
    title: 'Padrone di Casa (MS)',
    intro: "Leon, fratellone di MS! Benvenuto a casa mia a Monnaz! Fai come se fossi a casa tua. La festa è calda!",
    choices: [
      {
        text: "Kri, hai visto la bella Mari?",
        reply: "Mari è nei paraggi del salone vicino alla pista! Splende stasera, tutta MS la sta ammirando. Ma tieni gli occhi aperti: Maya è entrata dieci minuti fa e ha già chiesto di te tre volte!",
        reward: null
      },
      {
        text: "Dov'è il frigo? Mi serve un drink per Mari.",
        reply: "È proprio lì in cucina! Prendi pure quello che vuoi. Se trovi il 'Cocktail Fragola & Menta', a Mari farai brillare gli occhi!",
        reward: 'hint_drink'
      },
      {
        text: "Kri, che festa clamorosa!",
        reply: "Monnaz non delude mai! Goditi la serata, e se riesci a ritagliarti un momento da solo con Mari in terrazza o in camera... beh, complimenti bro!",
        reward: null
      }
    ]
  },

  mari: {
    speaker: 'Mari',
    avatar: 'mari',
    title: 'La ragazza più bella di MS ❤️',
    getIntro: (state) => {
      if (state.mariAloneWithLeon) {
        return "Leon... qui fuori è bellissimo. La luna sopra Monnaz, l'aria fresca... e noi due soli.";
      }
      if (state.mariFollowing) {
        return "Ti sto seguendo, Leon! Portami in un posto tranquillo... spero che nessuno ci disturbi!";
      }
      if (state.mariInterest >= 100) {
        return "Leon, sei stato dolcissimo stasera... c'è troppo casino qui nel salone. Ti andrebbe di mostrarmi la famosa terrazza o un posto più appartato dove parlare con calma?";
      }
      if (state.mariInterest >= 50) {
        return "Leon! Mi fa molto piacere parlare con te. Sei diverso dagli altri stasera, hai un'energia speciale.";
      }
      return "Ciao Leon! Che bella questa festa a Monnaz... la musica è forte, ma l'atmosfera è fantastica!";
    },
    getChoices: (state) => {
      // If already 100% and ready to follow
      if (state.mariInterest >= 100 && !state.mariFollowing) {
        return [
          {
            text: "Certo Mari! Vieni con me, conosco il posto perfetto.",
            action: 'start_follow',
            reply: "Arrivo con te! Fai strada tu, non farci vedere da troppa gente!"
          },
          {
            text: "Aspettami un secondo qui, controllo che non ci sia Maya in giro!",
            reply: "Va bene, ma sbrigati prima che qualcuno mi chieda di ballare!"
          }
        ];
      }

      // If already following
      if (state.mariFollowing) {
        return [
          {
            text: "Seguimi, quasi arrivati...",
            reply: "Ti seguo a ruota!"
          }
        ];
      }

      const choices = [
        {
          text: "Mari, sei incantevole stasera. Questo vestito rosa spicca su tutta la festa.",
          bonus: 25,
          reply: "Grazie Leon! Sei sempre un vero gentiluomo, mi fa molto piacere sentirtelo dire."
        },
        {
          text: "Leon & Mari: la coppia dell'anno a MS, che ne pensi?",
          bonus: 20,
          reply: "Ahaha che sfacciato! Però ammetto che hai stile e mi fai ridere."
        }
      ];

      if (state.inventory.includes('drink_mari')) {
        choices.unshift({
          text: "Ti ho portato questo speciale Cocktail Fragola & Menta dal frigo di Kri!",
          bonus: 55,
          consumeItem: 'drink_mari',
          reply: "Mio dio, il mio cocktail preferito! Ma come facevi a saperlo? Leon, sei incredibile!"
        });
      }

      if (state.djRomance) {
        choices.push({
          text: "Hai sentito la canzone che ha appena messo Lollo in consolle?",
          bonus: 30,
          reply: "È stupenda! Adoro questo genere di musica romantica... mi fa venire voglia di una passeggiata al chiaro di luna."
        });
      }

      return choices;
    }
  },

  maya: {
    speaker: 'Maya',
    avatar: 'maya',
    title: 'L\'incubo di Leon! 👓',
    intro: "LEOOOON! Finalmente ti ho trovato! Ho fatto un test dell'oroscopo su TikTok e dice che il nostro segno zodiacale è destinato a stare insieme per 80 anni!",
    choices: [
      {
        text: "Ehm... Maya, devo proprio andare a fare una cosa urgentissima...",
        reply: "Nooo aspetta! Guardami negli occhi! Guarda il mio nuovo maglione a pois fosforescenti! Ti piace?! Ti piace?!"
      },
      {
        text: "(Usa il pacchetto di patatine di Bubi)",
        requiresItem: 'chips_bubi',
        consumeItem: 'chips_bubi',
        action: 'distract_maya',
        reply: "Ooooh! Patatine al tartufo gourmet! Slurp! *Maya si fionda sulle patatine ignorando Leon per un po'*"
      }
    ]
  },

  lollo: {
    speaker: 'Lollo',
    avatar: 'lollo',
    title: 'DJ Resident MS 🎧',
    getIntro: (state) => {
      if (state.djRomance) {
        return "I bassi sono morbidi, le luci sono soffuse: Leon, la traccia romantica è on fire per te e Mari!";
      }
      return "Yo Leon! DJ Lollo ai controlli. Se vuoi che metta un pezzo lento e romantico per fare colpo su Mari, portami una birra dal frigo!";
    },
    getChoices: (state) => {
      if (state.inventory.includes('beer')) {
        return [
          {
            text: "Ecco la birra ghiacciata, Lollo! Metti su qualcosa di romantico per Mari!",
            consumeItem: 'beer',
            action: 'set_dj_romance',
            reply: "Bomba fratello! Cambio subito beat: traccia slow dance romantica in arrivo! Vai a prendere Mari!"
          }
        ];
      }
      return [
        {
          text: "Che musica stai mettendo?",
          reply: "Hit da ballare per la crew! Ma se mi porti una birra gelata dal frigo passo alla modalità slow-dance per farti conquistare Mari!"
        }
      ];
    }
  },

  bubi: {
    speaker: 'Bubi',
    avatar: 'bubi',
    title: 'Re degli Snack (MS) 🍟',
    intro: "Mmmm... crunch crunch! Leon, queste patatine al tartufo sono illegali. Ne vuoi un pacchetto?",
    choices: [
      {
        text: "Grazie Bubi, dammene uno! Potrebbero tornarmi utili.",
        action: 'give_chips',
        reply: "Tieni! Se vedi Maya che ti punta, buttale per terra: con quel maglione ha sempre fame e si bloccherà a mangiare!"
      },
      {
        text: "Bubi, tutto sotto controllo a Monnaz?",
        reply: "Tutto top! Solo Jelmo e Matti che si sfidano a beer pong e Kri che fa da arbitro. Goditi la festa!"
      }
    ]
  },

  matti: {
    speaker: 'Matti',
    avatar: 'matti',
    title: 'Party Animal (MS) 🕶️',
    intro: "LEOOON! Fratello mio! Stasera Monnaz è leggenda! Hai visto Mari?! È la ragazza più bella mai vista in tutto il cantone!",
    choices: [
      {
        text: "Sto provando a chiederle di uscire in terrazza, ma Maya mi marca stretto!",
        reply: "Tranquillo bro! Se Maya si avvicina troppo alla cucina fammi un fischio: fingo uno svenimento sul divano e attiro tutti lì!"
      },
      {
        text: "Chi sta vincendo a Beer Pong?",
        reply: "Io ovvio! Tre bicchieri di fila! Dai un occhio al frigo se cerchi qualcosa di buono."
      }
    ]
  },

  ento: {
    speaker: 'Ento',
    avatar: 'ento',
    title: 'Il Saggio del Gruppo (MS) 🧢',
    intro: "Bella Leon! Ti vedo concentrato stasera. Obiettivo Mari?",
    choices: [
      {
        text: "Esatto Ento. Voglio portarla in un posto tranquillo per parlarle a quattr'occhi.",
        reply: "La Terrazza Panoramica è il top assoluto: vista sui monti e stelle di Monnaz. Assicurati solo che la porta sia chiusa e che Maya sia lontana!"
      },
      {
        text: "Come semino Maya se mi insegue?",
        reply: "Premi il tasto SHIFT per scattare! E sfrutta i mobili: gira attorno al tavolo della cucina o al divano del salone!"
      }
    ]
  },

  jona: {
    speaker: 'Jona',
    avatar: 'jona',
    title: 'Membro MS 👕',
    intro: "Leon! Che serata a Monnaz! Hai già parlato con Mari?",
    choices: [
      {
        text: "Sì, ci stiamo avvicinando!",
        reply: "Grande! Tutta la crew di MS tifa per te. Mari ha proprio un debole per i ragazzi decisi e romantici."
      }
    ]
  },

  pibe: {
    speaker: 'Pibe',
    avatar: 'pibe',
    title: 'Il Bomber (MS) ⚽',
    intro: "Leon! Dribbling secco su Maya e assist per il gol con Mari! Come sul campo!",
    choices: [
      {
        text: "Pibe, dammi uno schema tattico per stasera!",
        reply: "Semplice: 1) Prendi il cocktail nel frigo, 2) Offrilo a Mari, 3) Falla ballare, 4) Fuga verso la terrazza o la camera relax! Maya in fuorigioco!"
      }
    ]
  },

  roby: {
    speaker: 'Roby',
    avatar: 'roby',
    title: 'Membro MS 💚',
    intro: "Leon! Mari prima guardava verso l'ingresso e ha chiesto a Lindi se eri già arrivato!",
    choices: [
      {
        text: "Davvero?! Ha chiesto di me?",
        reply: "Giuro! Sei in pole position, bro. Non fare passi falsi e non farti beccare da Maya!"
      }
    ]
  },

  lindi: {
    speaker: 'Lindi',
    avatar: 'lindi',
    title: 'Amica di Mari (MS) ✨',
    intro: "Leon! Devo dirti una cosa: Mari oggi a casa ha provato tre vestiti diversi prima di scegliere questo rosa per la festa a Monnaz!",
    choices: [
      {
        text: "Le sta d'incanto. È davvero bellissima.",
        reply: "Faglielo capire! Ma soprattutto trova un momento per restare da solo con lei, qui c'è troppo chiasso per parlare sul serio."
      }
    ]
  },

  jelmo: {
    speaker: 'Jelmo',
    avatar: 'jelmo',
    title: 'L\'Analista Tattico (MS) 📊',
    intro: "Leon. Ho calcolato che la casa di Kri ha esattamente due stanze con indice di privacy superiore al 90%: la Camera da Letto e la Terrazza Esterna.",
    choices: [
      {
        text: "E qual è il rischio Maya?",
        reply: "Rischio critico nel corridoio. Maya ha un raggio di rilevamento visivo di circa 180 pixel. Muoviti radente ai muri per massimizzare il successo."
      }
    ]
  },

  ara: {
    speaker: 'Ara',
    avatar: 'ara',
    title: 'Membro MS 🌸',
    intro: "Leon! Che gioia averti qui! Sei riuscito a salutare Mari?",
    choices: [
      {
        text: "Ci sto provando, ma c'è sempre gente intorno!",
        reply: "Falle una sorpresa con la musica e invitala a prendere un po' d'aria sul balcone. Quando siete soli si scioglierà subito!"
      }
    ]
  }
};

window.DIALOGUES = DIALOGUES;
