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
    let changewordPhrases = ['Сделано!','Готово!','Новое слово на экране!'];
    let changemodePhrases = ['Сделано!','Готово!','Новый режим включён!'];
    let maleFailPhrases = ['Я пока не выучил эту команду', 'Расшифровка этого займет несколько часов',
        'Над этим мне нужно подумать', 'Разработчики работают над добавлением этой команды',
        'Скоро я пойму, что это значит'];
    let femaleFailPhrases = ['Я пока не выучила эту команду', 'Расшифровка этого займет несколько часов',
        'Над этим мне нужно подумать', 'Разработчики работают над добавлением этой команды',
        'Скоро я пойму, что это значит'];
    let GuessedRightPhrases = ['Так держать!','Превосходно!','',''];
    let GuessedWrongPhrases = ['Ничего страшного!','Всё хорошо!','',''];
    let officialGreets = ['Добро пожаловать в приложение «Слова для Крокодила»! Суть игры - объяснить слово с экрана, используя только мимику, жесты и движения. Я помогу вам подобрать интересные слова. Для этого выберите режим и нажмите или скажите «Новое слово».'];
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
