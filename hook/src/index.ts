import { Dialute, SberRequest } from 'dialute';

const textToCommand = (texts: string[]) => {
    console.log('textToCommand in index.ts');
    let text = texts.join(' ');
    text = text.toLocaleLowerCase();

    let changeword = ['смени','покажи','новое слово','поменяй','смени','покажи новое слово','другое слово','поменяй слово','смени слово','покажи другое слово'];
    let changemode = ['другой режим','новый режим','смени режим','поменяй режим'];
    let helps = ['справка', 'помог', 'помощи', 'как игр', 'научи', 'почему', 'что делать', 'что умеешь'];
    let greets = ['привет', 'здравствуй', 'здарова', 'здорова', 'хай', 'хеллоу'];
    let restarts = ['заново', 'новая игра', 'с начала', 'перезап', 'снова', 'по новой'];
    let guessedright = ['угадали','угадано','выиграли','отгадали','отгадано', 'выиграно'];
    let guessedwrong = ['не угадали','не угадано','не выиграли','не отгадали','не отгадано', 'не выиграно'];

    for (let dir of changeword) {
        if (text.includes(dir)) return {type: 'changeword'};
    }
    for (let dir of changemode) {
        if (text.includes(dir)) return {type: 'changemode'};
    }
    for (let help of helps){
        if (text.includes(help)) return {type: 'help'};
    }
    for (let greet of greets){
        if (text.includes(greet)) return {type: 'greet'};
    }
    for (let restart of restarts){
        if (text.includes(restart)) return {type: 'restart'};
    }
    for (let dir of guessedwrong){
        if (text.includes(dir)) return {type: 'guessedwrong'};
    }
    for (let dir of guessedright){
        if (text.includes(dir)) return {type: 'guessedright'};
    }
    return {type: 'fail'};
}

function* script(r: SberRequest) {
    const rsp = r.buildRsp();
    let changewordPhrases = ['Сделано','Готово','Новое слово'];
    let changemodePhrases = ['Сделано','Готово','Новый режим'];
    let maleFailPhrases = ['Я пока не выучил эту команду', 'Расшифровка этого займет несколько часов',
        'Над этим мне нужно подумать', 'Разработчики работают над добавлением этой команды',
        'Скоро я пойму, что это значит'];
    let femaleFailPhrases = ['Я пока не выучила эту команду', 'Расшифровка этого займет несколько часов',
        'Над этим мне нужно подумать', 'Разработчики работают над добавлением этой команды',
        'Скоро я пойму, что это значит'];
    let GuessedRightPhrases = ['Так держать!','Превосходно!','',''];
    let GuessedWrongPhrases = ['Ничего страшного!','Всё хорошо!','',''];
    let officialGreets = ['Здравствуйте'];
    let unOfficialGreets = ['Привет', 'Привет-привет', 'Салют'];
    let { gender, appeal } = r.body.payload.character;

    let phrase;
    if (appeal === 'official') {
        let phraseIndex = Math.floor(Math.random() * officialGreets.length);
        phrase = officialGreets[phraseIndex];
    }else {
        let phraseIndex = Math.floor(Math.random() * unOfficialGreets.length);
        phrase = unOfficialGreets[phraseIndex];
    }
    rsp.msg = phrase;
    rsp.data = {type: 'init'};
    yield rsp;

    while (true) {
        if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'your_action_id') {
            // from front to back actions with assistant.sendData;
        } else if (r.type === 'MESSAGE_TO_SKILL'){
            let texts = r.nlu.texts;
            let command = textToCommand(texts);
            if (command.type === 'changeword') {
                let phraseIndex = Math.floor(Math.random() * changewordPhrases.length);
                rsp.msg = changewordPhrases[phraseIndex];
                rsp.data = command;
            }
            else if (command.type === 'changemode') {
                let phraseIndex = Math.floor(Math.random() * changemodePhrases.length);
                rsp.msg = changemodePhrases[phraseIndex];
                rsp.data = command;
            }
            else if (command.type == 'guessedwrong') {
                let phraseIndex = Math.floor(Math.random() * GuessedWrongPhrases.length);
                rsp.msg = GuessedWrongPhrases[phraseIndex];
                rsp.data = command;
            }
            else if (command.type == 'guessedright') {
                let phraseIndex = Math.floor(Math.random() * GuessedRightPhrases.length);
                rsp.msg = GuessedRightPhrases[phraseIndex];
                rsp.data = command;
            }
            else if (command.type === 'fail') {
                if (gender == 'male') {
                    let phraseIndex = Math.floor(Math.random() * maleFailPhrases.length);
                    phrase = maleFailPhrases[phraseIndex];
                }else{
                    let phraseIndex = Math.floor(Math.random() * femaleFailPhrases.length);
                    phrase = femaleFailPhrases[phraseIndex];
                }
                rsp.msg = phrase;
                rsp.data = command;
            }else if (command.type === 'help') {
                rsp.data = command;
                rsp.msg = 'Суть игры - объяснить слово с экрана без слов. Правила игры: Игрок показывает слово, используя только мимику, жесты, движения. Ему запрещается произносить слова и звуки, особенно те, по которым легко угадать слово. Запрещается губами проговаривать слова. Запрещается показывать загаданное слово по буквам, т.е. показывать слова, первые буквы которых будут складывать загаданное слово! Отгадывающие могут: задавать игроку любые вопросы; просить игрока показать синонимы; перечислять любые появляющиеся варианты. Помните, что очень многое зависит от активности тех, кто отгадывает, от их умения задавать наиболее существенные вопросы. Слово считается разгаданным, если слово произнесено именно так, как оно было загадано. Приятной игры!';
            }else if (command.type === 'greet') {
                if (appeal === 'official') {
                    let phraseIndex = Math.floor(Math.random() * officialGreets.length);
                    phrase = officialGreets[phraseIndex];
                }else {
                    let phraseIndex = Math.floor(Math.random() * unOfficialGreets.length);
                    phrase = unOfficialGreets[phraseIndex];
                }
                rsp.msg = phrase;
                rsp.data = command;
            }else if (command.type === 'restart'){
                rsp.msg = '';
                rsp.data = command;
            }
        }
        yield rsp;
    }
}

Dialute
    .fromEntrypoint(script as GeneratorFunction)
    .start();
