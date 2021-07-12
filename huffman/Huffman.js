function node(name, weight, used, code, reference)
{
    this.name = name;
    this.weight = weight;
    this.used = used;
    this.code = code;
    this.reference = reference;
}

var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile('input.txt');
var string = file.ReadAll();
file.Close();

var fso = new ActiveXObject("Scripting.FileSystemObject");
var file = fso.OpenTextFile("output.txt", 2, true);

var alphabet = new Array();

for (var i = 0; i < string.length; i++)
    alphabet[string.charAt(i)] = 0;
for (var i = 0; i < string.length; i++)
    alphabet[string.charAt(i)]++;

var tree = new Array();

file.WriteLine('Alphabet:')
for (var char in alphabet) 
{
    file.WriteLine(char + ' ' + alphabet[char]);
    n = new node(char, alphabet[char], false, '', null);
    tree.push(n);
}

var originalTreeLength = tree.length;

for (var k = 1; k < originalTreeLength; k++)
{
    var frequency1 = string.length;
    var num1 = 0;
    for (var i = 0; i < tree.length; i++)
        if ((tree[i].weight < frequency1) && (tree[i].used == false))
        {
            frequency1 = tree[i].weight;
            num1 = i;
        }

    tree[num1].used = true;
    tree[num1].code = 0;
    tree[num1].reference = tree.length;

    var frequency2 = string.length;
    var num2 = 0;
    for (var i = 0; i < tree.length; i++)
        if ((tree[i].weight < frequency2) && (tree[i].used == false))
        {
            frequency2 = tree[i].weight;
            num2 = i;
        }

    tree[num2].used = true;
    tree[num2].code = 1;
    tree[num2].reference = tree.length;
    n = new node(tree[num1].name + tree[num2].name, tree[num1].weight + tree[num2].weight, false, '', null);
    tree.push(n);
}

var codeTable = new Array();
for (var i = 0; i < originalTreeLength; i++)
{
    var current = i;
    codeTable[tree[current].name] = '';
    while (tree[current].reference != null)
    {
        codeTable[tree[i].name] = tree[current].code + codeTable[tree[i].name];
        current = tree[current].reference;
    }
}

file.WriteLine('Code char: ')
for (var i in codeTable)
    file.WriteLine(i + ' ' + codeTable[i]);

