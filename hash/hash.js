const fs = require("fs");

//счетчик для ключей -c -n -t
var key = 2;
//массив ключей
var keys = [];
//флаг на произвольное натуральное число по ключу -n для вывода
var N = -1;

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

//считываем b/h1/h2/h3
let mode = process.argv[key];
//считываем имя файла со строкой
let str = process.argv[key + 1];
//читаем имя файла с подстрокой
let substr = process.argv[key + 2];

//смотрим нормально ли считалось
/*console.log('N - ' + N);
console.log('mode ' + mode);
console.log('str ' + str);
console.log('substr ' + substr);
console.log('keys: ' + keys);
console.log('key: ' + keys[0]);
*/
//задаем входную троку
var string = fs.readFileSync(str, "utf8");
//console.log(typeof(string));

//задаем входную подстроку
var substring = fs.readFileSync(substr, "utf8");
//Brute Forse

if (mode === 'b')
    bruteForce();
if (mode === 'h1')
    codeSum();
if (mode === 'h2')
    codeSqrSum();
if (mode === 'h3')
    rabinCarp();

//выводим результат в консоль
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

//BruteForce
function bruteForce ()
{
    console.log('Brute forse');
    var result = [];
    var res = [];
    //начинаем отсет времени алгоритма
    var start = (new Date()).getTime();

    //пока символ в строке до string.length - substring.length,
    //потому что очевидно, что строка из 5 не влезет в "хвост" из 4
    for (var i = 0; i <= string.length - substring.length; i++) 
    {
        //пока символ Nой позиции из строки соответсвует Mому из подстроки
        for (var j = 0; string.charAt(i + j) == substring.charAt(j); j++) 
        {
            //все совпало?
            if (j == substring.length - 1) 
            {
                //добавляем вхождение и выходим,
                //чтобы дальше не производил соответвия т.к. подстрока кончилась
                result.push(i);
                break;
            }
        }
    }
    //заканчиваем отсчет времени
    var end = (new Date()).getTime();

    //выводим результат в консоль
    printResult(result);

    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-t') != -1)
        console.log('time of working: ' + (end - start) + ' milliseconds');
}
//далее логика for и значение переменных никак не меняется
//Rabin-Carp
function calculateHashRC(string) 
{
    var hash = 0;
    for (var i = 0; i < string.length; i++)
    {
        var charCode = string.charCodeAt(i)
        //(1 << (string.length - i)) побитовый сдвиг
        hash = hash + charCode * (1 << (string.length - i));
    }
    return hash;
}

function rabinCarp ()
{
    console.log('Rabin-Carp');
    var result = [];
    var substringHash = calculateHashRC(substring);
    //самый первый хэш по длине подстроки
    var stringHash = calculateHashRC(string.slice(0, substring.length));
    var start = (new Date()).getTime();
    var collisionCount = 0;
    //флаг для подсчета колизий
    var fl = 0;

    for (var i = 0; i <= string.length - substring.length; i++) 
    {
        //если хэши совпали проверяем
        if (substringHash === stringHash) 
        {
            fl = 1;
            for (var j = 0; string.charAt(i + j) == substring.charAt(j); j++) 
            {
                if (j === substring.length - 1) 
                {
                    result.push(i);
                    //fl = 1;
                    break;
                }
            }
            if (fl === 1)
            {
                collisionCount++;
                fl = 0;
            }
        }
        //обновление хэша (удаляем то, что стояло на iом месте(первый символ), добавляем "последний" символ по длине подстроки
        stringHash = 2 * (stringHash - string.charCodeAt(i) * (1 << substring.length) + string.charCodeAt(i + substring.length));
    }

    collisionCount -= result.length; 
    var end = (new Date()).getTime();

    //выводим результат в консоль
    printResult(result);

    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-c') != -1)
        console.log('Collisions: ' + collisionCount);
    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-t') != -1)
        console.log('time of working: ' + (end - start) + ' milliseconds');
}

//Code sum
function calculateHashSum(string) 
{
    var hash = 0;
    for (var i = 0; i < string.length; i++)
        //сумма хэшей
        hash += string.charCodeAt(i);
    return hash;
}

function codeSum()
{
    console.log('Sum of code');
    var result = [];
    var substringHash = calculateHashSum(substring);
    var stringHash = calculateHashSum(string.substr(0, substring.length));
    var start = (new Date()).getTime();
    var collisionCount = 0;
    var fl = 0;

    for (var i = 0; i <= string.length - substring.length; i++) 
    {
        if (substringHash == stringHash) 
        {
            fl = 1;
            for (var j = 0; string.charAt(i + j) == substring.charAt(j); j++) 
            {
                if (j == substring.length - 1) 
                {
                    result.push(i);
                    //fl = 1;
                    break;
                }
            }
            if (fl == 1)
            {
                collisionCount++;
                fl = 0;
            }
        }
        stringHash = stringHash - string.charCodeAt(i) + string.charCodeAt(i + substring.length);
    }

    collisionCount -= result.length; 
    var end = (new Date()).getTime();

    //выводим результат в консоль
    printResult(result);

    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-c') != -1)
        console.log('Collisions: ' + collisionCount);
    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-t') != -1)
        console.log('time of working: ' + (end - start) + ' milliseconds');
}

//Code sqr sum
function calculateHashSQR(string) 
{
    var hash = 0;
    for (var i = 0; i < string.length; i++)
        //сумма квадратов
        hash += (Math.pow(string.charCodeAt(i), 2));
    return hash;
}

function codeSqrSum()
{
    console.log('Sum of code square');
    var result = [];
    var substringHash = calculateHashSQR(substring);
    var stringHash = calculateHashSQR(string.substr(0, substring.length));
    var start = (new Date()).getTime();
    var collisionCount = 0;
    var fl = 0;

    for (var i = 0; i <= string.length - substring.length; i++) 
    {
        if (substringHash == stringHash) 
        {
            fl = 1;
            for (var j = 0; string.charAt(i + j) == substring.charAt(j); j++) 
            {
                if (j == substring.length - 1) 
                {
                    result.push(i);
                    //fl = 1;
                    break;
                }
            }
            if (fl == 1)
            {
                collisionCount++;
                fl = 0;
            }
        }
        stringHash = stringHash - Math.pow(string.charCodeAt(i), 2) + Math.pow(string.charCodeAt(i + substring.length), 2);
    }

    collisionCount -= result.length; 
    var end = (new Date()).getTime();

    //выводим результат в консоль
    printResult(result);

    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-c') != -1)
        console.log('Collisions: ' + collisionCount);
    //проверяем запрашивали ли такой ключ
    if (keys.indexOf('-t') != -1)
        console.log('time of working: ' + (end - start) + ' milliseconds');
}