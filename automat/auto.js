const fs = require("fs");

//счетчик для ключей -c -n -t
var key = 2;
//массив ключей
var keys = [];
//флаг на произвольное натуральное число по ключу -n для вывода
var N = -1;

var automat_table = [[]];
//считываем поступившие ключи
while (key < 6)
{
    //если ключ "-"
    if (process.argv[key][0] === '-')
    {
        //добавляем его в список ключей
        keys.push(process.argv[key]);

        //если ключ -n, то смотрим следующий параметр N
        if (process.argv[key][1] === 'n')
        {
            //"переключаемся" на N
            key += 1;
            //считываем N
            N = process.argv[key];
        }

    } else {
        //если поступил не ключ, то считывание ключей необходимо прекратить
        break;
    };
    //"переключаемся" на следующий параметр
    key += 1;
}

//считываем имя файла со строкой
let str = process.argv[key];
//считываем имя файла с подстрокой
let substr = process.argv[key + 1];

var string = fs.readFileSync(str, "utf8");
var substring = fs.readFileSync(substr, "utf8");

Aho_Karasik();

function printResult(result)
{
    var res = []
    //проверяем есть ли вхождения
    if (result.length == 0)
    {
        console.log('Substring not found');
    } else {
        //выполняем условия вывода результата
        if ((N === -1) || (result.length <= N))
            console.log('Position: ' + result);
        else {
            for (var i = 0; i < N; i++)
            {
                res.push(result[i]);
            }
            console.log('Position: ' + res);
        }
    }
}

function Aho_Karasik()
{
    var start = (new Date()).getTime();
    //создаем алфавит
    var alphabet = new Array();
    for (var i = 0; i < substring.length; i++)
    {
        alphabet[substring.charAt(i)] = 0;
    }

    //заполняем шапку таблицы автомата, которую выведем в консоль 
    automat_table[0][0] = " ";
    count = 1;
    for (var i in alphabet)
    {
        automat_table[0][count] = i;
        count += 1;
    }
    automat_table[0].push("*");//"звездочка" алфавита
    alphabet['*'] = 0; //"звездочка" алфавита

    //строим таблицу автомата с которой работает алгоритм
    var transitionTable = new Array(substring.length + 1);
    //задаем двумерный массив
    for (var j = 0; j <= substring.length; j++)
        transitionTable[j] = new Array();

    for(var i in alphabet)
        transitionTable[0][i] = 0;
    //по солодушкину стр. 66 https://elar.urfu.ru/bitstream/10995/31217/1/978-5-7996-1064-7_2013.pdf 
    for (var j = 0; j < substring.length; j++)
    {
        prev = transitionTable[j][substring.charAt(j)];
        //console.log(prev);
        //console.log(substring.charAt(j));
        transitionTable[j][substring.charAt(j)] = j + 1;
        //console.log(transitionTable);
        for (var i in alphabet)
            transitionTable[j+1][i] = transitionTable[prev][i];
            //console.log(transitionTable)
    }

    var out = '';
    //готовим к выводу в консоль шапку таблицы
    for (var i in automat_table[0])
        out += automat_table[0][i] + ' ';
    //выводим шапку, если поступил ключ -а
    if (keys.indexOf('-a') != -1)
        console.log(out);
    for (var j = 0; j <= substring.length; j++)
    {
        //вывод таблицы в "числах"
        var out = '';
        for (var i in alphabet)
            out += transitionTable[j][i] + ' ';
/////////////////////////////////////////////////////////////////
//заполнение двумерного массива для буквенной таблицы        
        //automat_table[j+1] = Array();
        //automat_table[j+1].push(substring.slice(0, j));
        //заполняем таблицу для вывода в консоль
        //add = '';
        //for (var i in alphabet)
        //{
        //    if (transitionTable[j][i] != 0)
        //        add += automat_table[j][0] + i;
        //    else
        //        add = ''
            //console.log(i)
            //console.log(transitionTable);
            //console.log(transitionTable[j]);
            //console.log(transitionTable[j][i]);
        //    automat_table[j+1].push(add);
        //}
///////////////////////////////////////////////////////////////
        if (keys.indexOf('-a') != -1)
            console.log(j + ' ' + out);
    }
    //вывод двумерного массива с буквененым представлением
    //if (keys.indexOf('-a') != -1)
    //    console.log(automat_table);

    var result = [];
    var status = 0;

    //"перещелкиваемся" по таблице автомата
    for (var i = 0; i < string.length; i++)
    {
        if (!transitionTable[status][string.charAt(i)])
            transitionTable[status][string.charAt(i)] = 0;
        status = transitionTable[status][string.charAt(i)];
        if (status == substring.length)
            result.push(i - substring.length + 1);
    }

    printResult(result);

    var end = (new Date()).getTime();
    if (keys.indexOf('-t') != -1)
        console.log('time of working: ' + (end - start) + ' milliseconds');
}