const { SlashCommandBuilder } = require('discord.js');

// Will store the operands for parsing the string
const numStack = [];
// Will store the operators for parsing the string
const opStack = [];
// Set of operators to enable O(1) member checking
const opSet = new Set(['+', '-', '/', '*']);
const data = new SlashCommandBuilder()
	.setName('calc')
	.setDescription('Will do simple mathematical calculations with integers')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('String to parse and calculate')
			.setRequired(true));

async function execute(interaction) {
	// Input string option (added to the data above)
	// The RegExp rids the input of any whitespace so that parsing it is much simpler
	const input = interaction.options.getString('input').replace(/\s*/g, '');

	// Verify that parentheses are valid (each opening parenthesis has a corresponding closing parenthesis)
	const parStack = [];
	for (c of input) {
		if (c == '(') {
			parStack.push(c);
		}
		else if (c == ')') {
			if (!parStack.length) {
				interaction.reply('Your input is invalid due to parentheses mismatching');
				return;
			}
			parStack.pop();
		}
	}
	if (parStack.length) {
		interaction.reply('Your input is invalid due to parentheses mismatching');
		return;
	}
	last = input[input.length - 1];
	first = input[0];
	if ((!(last >= '0' && last <= '9') && last != ')') || (!(first >= '0' && first <= '9') && first != '(')) {
		interaction.reply('Your input is invalid, cannot start or end with an operator or invalid character :(');
		return;
	}


	for (i = 0; i < input.length; i++) {
		const c = input[i];
		if (c >= '0' && c <= '9') {
			[num, pos] = parseNumber(input, i);
			numStack.push(num);
			i = pos - 1;
		}
		else {
			if (!opSet.has(c) && c != '(' && c != ')') {
				interaction.reply('Your input is invalid. Note: I can\'t do decimals yet :(');
				return;
			}
			// Validates that each operator and each parenthesis is followed by a number
			if (opSet.has(input[i + 1])) {
				interaction.reply('Your input is invalid');
				return;
			}

			if (c == '+' || c == '-' || c == '(') {
				opStack.push(c);
			}
			else if (c == '*' || c == '/') {
				[num2, pos] = parseNumber(input, i + 1);
				i = pos - 1;
				num1 = numStack.pop();

				if (c == '*') numStack.push(num1 * num2);
				else numStack.push(num1 / num2);
			}
			// Here, c = ')', so all calculations should be executed until '(' is found in opStack
			// Again, only operands left are '+' and '-' since '*' and '/' are calculated the moment they're come across
			else {
				op = '';
				while (opStack[opStack.length - 1] != '(') {
					num2 = numStack.pop();
					num1 = numStack.pop();
					op = opStack.pop();
					if (op == '+') numStack.push(num1 + num2);
					else numStack.push(num1 - num2);
				}
				opStack.pop();
			}
		}
	}
	// The only operands that should be left are + and -, since * and / are calculated
	// immediately when they're encountered (in the for loop)
	while (opStack.length) {
		num2 = numStack.pop();
		num1 = numStack.pop();
		op = opStack.pop();
		if (op == '+') numStack.push(num1 + num2);
		else numStack.push(num1 - num2);
	}
	const result = numStack.pop();
	interaction.reply(result.toString());
}

// This will parse a number from the string, starting at the given position
// Complexity: O(n), n being the length of the number, max time is length of string
// Returns: Parsed number, and ending position
// Note: the ending position will be one after the ending digit in the parsed number
// Example: '555a' will return [555, 3], '2005fjdk' will return [2005, 4]
function parseNumber(str, pos) {
	if (pos > str.length) return;
	let result = '';
	for (i = pos; i < str.length; i++) {
		if (str[i] >= '0' && str[i] <= '9') {
			result += str[i];
		}
		else {
			return [parseInt(result), i];
		}
	}
	return [parseInt(result), str.length];
}


module.exports = { data, execute };