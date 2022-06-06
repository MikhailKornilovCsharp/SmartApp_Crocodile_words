import { Dialute, SberRequest } from 'dialute';

const textToCommand = (texts: string[]) => {
    console.log('textToCommand in index.ts');
    let text = texts.join(' ');
    text = text.toLocaleLowerCase();

    let changeword = ['смени','покажи','новое слово','поменяй','смени','покажи новое слово','другое слово','поменяй слово','смени слово','покажи другое слово'];
    let changemode = ['другой режим','новый режим','смени режим','поменяй режим','режим'];
    let helps = ['справка', 'помог', 'помощи', 'как игр', 'научи', 'почему', 'что делать', 'что умеешь', 'навык'];
    let greets = ['привет', 'здравствуй', 'здарова', 'здорова', 'хай', 'хеллоу'];
    let restarts = ['заново', 'новая игра', 'с начала', 'перезап', 'снова', 'по новой'];

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
                rsp.msg = '';
                rsp.data = command;
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
