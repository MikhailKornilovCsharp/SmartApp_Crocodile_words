import { Dialute, SberRequest } from 'dialute';

const textToCommand = (texts: string[]) => {
    console.log('textToCommand in index.ts');
    let text = texts.join(' ');
    text = text.toLocaleLowerCase();

    let changeword = ['покажи слово', 'новое слово','покажи новое слово','другое слово','поменяй слово','смени слово','покажи другое слово'];
    let changemode = ['другой режим','новый режим','смени режим','поменяй режим'];
    let helps = ['справка', 'помог', 'помощ', 'как игр', 'научи', 'почему', 'что делать', 'что умеешь', 'правила'];
    let greets = ['привет', 'здравствуй', 'здарова', 'здорова', 'хай', 'хеллоу'];
    let restarts = ['заново', 'новая игра', 'с начала', 'перезап', 'снова', 'по новой'];
    let guessedright = ['угадал','угадано','выиграл','отгадал','отгадано', 'выиграно'];
    let guessedwrong = ['не угадал','не угадано','не выиграл','не отгадал','не отгадано', 'не выиграно','неугаданно'];
    let close = ['закр','закрой помощь','скрой помощь','закрой справку', 'скрой справку', 'закрой мануал', 'скрой мануал', 'убери помощь', 'убери справку', 'убери мануал', 'поня', 'ясно', 'понял'];

    for (let dir of changeword) {
        if (text.includes(dir)) return {type: 'changeword'};
    }
    for (let dir of changemode) {
        if (text.includes(dir)) return {type: 'changemode'};
    }
    for (let dir of close){
        if (text.includes(dir)) return {type: 'close'};
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
    let changewordPhrases = ['Сделано!','Готово!','Новое слово на экране!'];
    let changemodePhrases = ['Сделано!','Готово!','Новый режим включён!'];
    let maleofficialFailPhrases = ['Я пока не выучил эту команду. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет'];
    let maleno_officialFailPhrases = ['Я пока не выучил эту команду. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет'];
    let femaleofficialFailPhrases = ['Я пока не выучила эту команду. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажите «помощь» или нажмите на одноимённую кнопку, возможно, это чем-то поможет'];
    let femaleno_officialFailPhrases = ['Я пока не выучила эту команду. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажи «помощь» или нажми на одноимённую кнопку, возможно, это чем-то поможет'];
    let GuessedRightPhrases = ['Так держать!','Превосходно!','',''];
    let GuessedWrongPhrases = ['Ничего страшного!','Повезёт в следующий раз!','',''];
    let officialGreets = ['Здравствуйте!'];
    let unOfficialGreets = ['Салют!'];
    let { gender, appeal } = r.body.payload.character;

    let phrase;
    let phraseIndex = Math.floor(Math.random() * officialGreets.length);
    phrase = officialGreets[phraseIndex] + ` Добро пожаловать в приложение «Слова для Крокодила»! Данный смартап предназначен для всем известной игры, где ${(appeal === 'official' ? 'вам' : 'тебе')} нужно объяснить слово с экрана, используя только мимику, жесты и движения. Здесь можно попросить новое слово, поменять режим и даже вести счёт отгаданных слов!`;
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
            else if (command.type == 'guessedright') {
                let phraseIndex = Math.floor(Math.random() * GuessedRightPhrases.length);
                rsp.msg = GuessedRightPhrases[phraseIndex];
                rsp.data = command;
            }
            else if (command.type == 'guessedwrong') {
                let phraseIndex = Math.floor(Math.random() * GuessedWrongPhrases.length);
                rsp.msg = GuessedWrongPhrases[phraseIndex];
                rsp.data = command;
            }
            else if (command.type === 'fail') {
                let { gender, appeal } = r.body.payload.character;
                console.log(gender, appeal);
                if (gender == 'male') {
                    if (appeal == 'official') {
                        let phraseIndex = Math.floor(Math.random() * maleofficialFailPhrases.length);
                        phrase = maleofficialFailPhrases[phraseIndex];
                    }
                    else {
                        let phraseIndex = Math.floor(Math.random() * maleno_officialFailPhrases.length);
                        phrase = maleno_officialFailPhrases[phraseIndex];
                    }
                }
                else {
                    if (appeal == 'official') {
                        let phraseIndex = Math.floor(Math.random() * femaleofficialFailPhrases.length);
                        phrase = femaleofficialFailPhrases[phraseIndex];
                    }
                    else {
                        let phraseIndex = Math.floor(Math.random() * femaleno_officialFailPhrases.length);
                        phrase = femaleno_officialFailPhrases[phraseIndex];
                    }
                }
                rsp.msg = phrase;
                rsp.data = command;
            }else if (command.type === 'close') {
                rsp.data = command;
            }else if (command.type === 'help') {
                rsp.data = command;
                rsp.msg = 'Суть игры - объяснить слово с экрана, используя только мимику, жесты и движения. Кнопка «Режим»  - меняет сложность игры, в разных режимах разные слова. Кнопка «Новое слово»  - выдает новое слово из того же режима. Кнопка «Заново» - сбрасывает набранные очки. Удачной игры!';
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
