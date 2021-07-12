const fs = require("fs");

//счетчик для ключей -c -n -t
var key = 2;
//массив ключей
var keys = [];
//флаг на произвольное натуральное число по ключу -n для вывода
var N = -1;

var automat_table = [[]];
//считываем поступившие ключи
while (key < 5)
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

BauerMur();

function BauerMur()
{
	var start = (new Date()).getTime();

	var result = []; 
	var entry = []; 
	var count = 0;
	//построение таблицы "перескоков" "Таблица N наиболее правых вхождений символов"
	for(var k = 0; k < substring.length; k++) 
	{ 
		entry[substring.charAt(k)] = k + 1;
	} 

	var i = substring.length - 1;
	//начало перебора символов с позиции "длина подстроки" 
	while (i < string.length) 
	{ 
		//console.log(i + " " + "new");
		//стоп(плохой) символ
		if (entry[string.charAt(i)] == null) 
		{ 
			//console.log(i + " " + "in1"); 
			i+= substring.length; 
		} 
		else 
		{ 
			for (var j = 0; j < substring.length; ++j) 
			{
				//посимвольная проверка <--
				if (substring.charAt(substring.length - 1 - j) == string.charAt(i-j)) 
				{ 
					//console.log(i + " " + "new2")
					//слово найдено 
					if (j == substring.length - 1) 
					{
						//console.log((i - j)  + " " + "add")
						result.push(i - j) 
						i+=1; 
						break; 
					} 
				} 

				else 
				{ 
					//console.log(i + " " + "new3");
					//"перескок" по таблице
					i += Math.max(1, substring.length - entry[string.charAt(i)]); 
					break; 
				} 
			} 
		} 
	}

	printResult(result);

	var end = (new Date()).getTime();
    if (keys.indexOf('-t') != -1)
        console.log('time of working: ' + (end - start) + ' milliseconds');
}

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