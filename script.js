 // Initialize CodeMirror
        const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            mode: 'application/x-httpd-php',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            styleActiveLine: true,
            indentUnit: 4,
            indentWithTabs: false,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-Enter': runCode,
                'Cmd-Enter': runCode,
                'F5': runCode
            }
        });

        // Update cursor position
        editor.on('cursorActivity', () => {
            const cursor = editor.getCursor();
            document.getElementById('lineCol').innerHTML = `<span>Ln ${cursor.line + 1}, Col ${cursor.ch + 1}</span>`;
        });

        // Examples
        const examples = {
            hello: `<?php
echo "Bonjour, monde!\\n";
echo "Bienvenue dans l'éditeur PHP!\\n";
?>`,
            variables: `<?php
$nom = "Alice";
$age = 25;
$taille = 1.65;
$estEtudiant = true;

echo "Nom: $nom\\n";
echo "Âge: $age ans\\n";
echo "Taille: $taille m\\n";
echo "Étudiant: " . ($estEtudiant ? "Oui" : "Non") . "\\n";
?>`,
            arrays: `<?php
$fruits = ["Pomme", "Banane", "Orange", "Fraise"];

echo "Liste des fruits:\\n";
foreach ($fruits as $index => $fruit) {
    echo ($index + 1) . ". $fruit\\n";
}

$personne = [
    "nom" => "Bob",
    "age" => 30,
    "ville" => "Paris"
];

echo "\\nInformations:\\n";
foreach ($personne as $cle => $valeur) {
    echo "$cle: $valeur\\n";
}
?>`,
            functions: `<?php
function addition($a, $b) {
    return $a + $b;
}

function saluer($nom = "Visiteur") {
    return "Bonjour, $nom!";
}

echo saluer("Marie") . "\\n";
echo saluer() . "\\n";
echo "5 + 3 = " . addition(5, 3) . "\\n";
?>`,
            loops: `<?php
echo "Boucle for:\\n";
for ($i = 1; $i <= 5; $i++) {
    echo "Itération $i\\n";
}

echo "\\nBoucle while:\\n";
$j = 1;
while ($j <= 3) {
    echo "Compteur: $j\\n";
    $j++;
}

echo "\\nTable de multiplication de 7:\\n";
for ($i = 1; $i <= 10; $i++) {
    echo "7 × $i = " . (7 * $i) . "\\n";
}
?>`,
            conditions: `<?php
$note = 15;

echo "Note: $note/20\\n";

if ($note >= 16) {
    echo "Mention: Très bien\\n";
} elseif ($note >= 14) {
    echo "Mention: Bien\\n";
} elseif ($note >= 12) {
    echo "Mention: Assez bien\\n";
} elseif ($note >= 10) {
    echo "Mention: Passable\\n";
} else {
    echo "Mention: Insuffisant\\n";
}

$jour = "Lundi";
echo "\\nAujourd'hui: $jour\\n";

switch ($jour) {
    case "Lundi":
    case "Mardi":
        echo "Début de semaine\\n";
        break;
    case "Samedi":
    case "Dimanche":
        echo "Week-end!\\n";
        break;
    default:
        echo "Milieu de semaine\\n";
}
?>`
        };

        function toggleExamples() {
            const panel = document.getElementById('examplesPanel');
            panel.classList.toggle('hide');
        }

        function loadExample(exampleName) {
            editor.setValue(examples[exampleName]);
            toggleExamples();
        }

        function clearEditor() {
            editor.setValue('<?php\n\n?>');
            editor.setCursor(1, 0);
            editor.focus();
        }

        function clearConsole() {
            document.getElementById('consoleOutput').innerHTML = '<div style="color: #858585; font-style: italic;">Console effacée...</div>';
        }

        function getCurrentDateTime() {
            const now = new Date();
            const date = now.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
            const time = now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            return `CONSOLE: ${date}, ${time}`;
        }

        function addConsoleEntry(content, isError = false) {
            const consoleOutput = document.getElementById('consoleOutput');
            
            // Remove placeholder text if present
            if (consoleOutput.innerHTML.includes('Prêt à exécuter') || consoleOutput.innerHTML.includes('Console effacée')) {
                consoleOutput.innerHTML = '';
            }

            const entry = document.createElement('div');
            entry.className = 'console-entry' + (isError ? ' console-error' : '');
            
            const timestamp = document.createElement('div');
            timestamp.className = 'console-timestamp';
            timestamp.textContent = getCurrentDateTime();
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'console-content' + (isError ? ' console-error' : '');
            contentDiv.textContent = content;
            
            entry.appendChild(timestamp);
            entry.appendChild(contentDiv);
            
            consoleOutput.appendChild(entry);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }

        function runCode() {
            const code = editor.getValue();
            
            try {
                const result = interpretPHP(code);
                addConsoleEntry(result);
            } catch (error) {
                addConsoleEntry(`Erreur: ${error.message}`, true);
            }
        }

        function interpretPHP(code) {
            let output = '';
            
            // Retirer les balises PHP
            code = code.replace(/<\?php/gi, '').replace(/\?>/gi, '');
            
            // Variables pour stocker l'état
            const variables = {};
            const functions = {};
            
            // Fonction pour évaluer les expressions PHP
            function evalExpression(expr) {
                expr = expr.trim();
                
                // Remplacer les variables PHP par leurs valeurs
                expr = expr.replace(/\$(\w+)/g, (match, varName) => {
                    if (variables.hasOwnProperty(varName)) {
                        const value = variables[varName];
                        return typeof value === 'string' ? `"${value}"` : value;
                    }
                    return 'undefined';
                });
                
                // Remplacer les fonctions PHP courantes
                expr = expr.replace(/phpversion\(\)/gi, '"8.2.0"');
                expr = expr.replace(/count\(([^)]+)\)/gi, (match, arr) => {
                    try {
                        const evaluated = eval(arr);
                        return Array.isArray(evaluated) ? evaluated.length : 0;
                    } catch {
                        return 0;
                    }
                });
                
                try {
                    return eval(expr);
                } catch (e) {
                    return expr;
                }
            }
            
            // Traiter le code ligne par ligne
            const lines = code.split('\n');
            let inFunction = false;
            let functionName = '';
            let functionBody = [];
            let skipUntilEndif = 0;
            
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                
                if (!line || line.startsWith('//')) continue;
                
                // Gestion des fonctions
                if (line.match(/^function\s+(\w+)/)) {
                    inFunction = true;
                    functionName = line.match(/function\s+(\w+)/)[1];
                    functionBody = [];
                    continue;
                }
                
                if (inFunction) {
                    if (line === '}') {
                        functions[functionName] = functionBody.join('\n');
                        inFunction = false;
                        functionName = '';
                        functionBody = [];
                    } else {
                        functionBody.push(line);
                    }
                    continue;
                }
                
                // Gestion des conditions if/elseif/else
                if (skipUntilEndif > 0) {
                    if (line.includes('}') || line.includes('endif')) {
                        skipUntilEndif--;
                    }
                    continue;
                }
                
                if (line.match(/^if\s*\(/)) {
                    const condition = line.match(/if\s*\(([^)]+)\)/)[1];
                    const result = evalExpression(condition);
                    if (!result) {
                        skipUntilEndif = 1;
                    }
                    continue;
                }
                
                // Gestion des boucles for
                if (line.match(/^for\s*\(/)) {
                    const forMatch = line.match(/for\s*\(\s*([^;]+);\s*([^;]+);\s*([^)]+)\s*\)/);
                    if (forMatch) {
                        const init = forMatch[1].trim();
                        const condition = forMatch[2].trim();
                        const increment = forMatch[3].trim();
                        
                        // Initialisation
                        if (init.includes('=')) {
                            const [varPart, valuePart] = init.split('=');
                            const varName = varPart.replace('$', '').trim();
                            variables[varName] = evalExpression(valuePart);
                        }
                        
                        // Trouver le corps de la boucle
                        let loopBody = [];
                        let braceCount = 0;
                        let foundStart = false;
                        
                        for (let j = i; j < lines.length; j++) {
                            if (lines[j].includes('{')) {
                                foundStart = true;
                                braceCount++;
                            }
                            if (foundStart && j > i) {
                                loopBody.push(lines[j]);
                            }
                            if (lines[j].includes('}')) {
                                braceCount--;
                                if (braceCount === 0 && foundStart) {
                                    i = j;
                                    break;
                                }
                            }
                        }
                        
                        // Exécuter la boucle
                        let iterations = 0;
                        while (evalExpression(condition) && iterations < 1000) {
                            for (const bodyLine of loopBody) {
                                const trimmedLine = bodyLine.trim();
                                if (trimmedLine && trimmedLine !== '{' && trimmedLine !== '}') {
                                    processLine(trimmedLine);
                                }
                            }
                            
                            // Incrément
                            if (increment.includes('++')) {
                                const varName = increment.replace(/\$|\+\+/g, '').trim();
                                variables[varName]++;
                            } else if (increment.includes('--')) {
                                const varName = increment.replace(/\$|--/g, '').trim();
                                variables[varName]--;
                            }
                            
                            iterations++;
                        }
                        continue;
                    }
                }
                
                // Gestion des boucles foreach
                if (line.match(/^foreach\s*\(/)) {
                    const foreachMatch = line.match(/foreach\s*\(\s*\$(\w+)\s+as\s+(?:\$(\w+)\s*=>\s*)?\$(\w+)\s*\)/);
                    if (foreachMatch) {
                        const arrayName = foreachMatch[1];
                        const keyName = foreachMatch[2];
                        const valueName = foreachMatch[3];
                        
                        if (variables[arrayName]) {
                            let loopBody = [];
                            let braceCount = 0;
                            let foundStart = false;
                            
                            for (let j = i; j < lines.length; j++) {
                                if (lines[j].includes('{')) {
                                    foundStart = true;
                                    braceCount++;
                                }
                                if (foundStart && j > i) {
                                    loopBody.push(lines[j]);
                                }
                                if (lines[j].includes('}')) {
                                    braceCount--;
                                    if (braceCount === 0 && foundStart) {
                                        i = j;
                                        break;
                                    }
                                }
                            }
                            
                            const array = variables[arrayName];
                            if (Array.isArray(array)) {
                                array.forEach((value, index) => {
                                    if (keyName) variables[keyName] = index;
                                    variables[valueName] = value;
                                    
                                    for (const bodyLine of loopBody) {
                                        const trimmedLine = bodyLine.trim();
                                        if (trimmedLine && trimmedLine !== '{' && trimmedLine !== '}') {
                                            processLine(trimmedLine);
                                        }
                                    }
                                });
                            } else if (typeof array === 'object') {
                                Object.entries(array).forEach(([key, value]) => {
                                    if (keyName) variables[keyName] = key;
                                    variables[valueName] = value;
                                    
                                    for (const bodyLine of loopBody) {
                                        const trimmedLine = bodyLine.trim();
                                        if (trimmedLine && trimmedLine !== '{' && trimmedLine !== '}') {
                                            processLine(trimmedLine);
                                        }
                                    }
                                });
                            }
                        }
                        continue;
                    }
                }
                
                // Gestion des boucles while
                if (line.match(/^while\s*\(/)) {
                    const whileMatch = line.match(/while\s*\(([^)]+)\)/);
                    if (whileMatch) {
                        const condition = whileMatch[1];
                        
                        let loopBody = [];
                        let braceCount = 0;
                        let foundStart = false;
                        
                        for (let j = i; j < lines.length; j++) {
                            if (lines[j].includes('{')) {
                                foundStart = true;
                                braceCount++;
                            }
                            if (foundStart && j > i) {
                                loopBody.push(lines[j]);
                            }
                            if (lines[j].includes('}')) {
                                braceCount--;
                                if (braceCount === 0 && foundStart) {
                                    i = j;
                                    break;
                                }
                            }
                        }
                        
                        // Exécuter la boucle
                        let iterations = 0;
                        while (evalExpression(condition) && iterations < 1000) {
                            for (const bodyLine of loopBody) {
                                const trimmedLine = bodyLine.trim();
                                if (trimmedLine && trimmedLine !== '{' && trimmedLine !== '}') {
                                    processLine(trimmedLine);
                                }
                            }
                            iterations++;
                        }
                        continue;
                    }
                }
                
                processLine(line);
            }
            
            function processLine(line) {
                // Gestion de echo
                if (line.match(/^echo\s+/i)) {
                    let content = line.replace(/^echo\s+/i, '').replace(/;$/, '').trim();
                    
                    // Gérer les concaténations avec .
                    const parts = content.split(/\s*\.\s*/);
                    let result = '';
                    
                    for (const part of parts) {
                        let evaluated = part.trim();
                        
                        // Chaînes entre guillemets
                        if ((evaluated.startsWith('"') && evaluated.endsWith('"')) || 
                            (evaluated.startsWith("'") && evaluated.endsWith("'"))) {
                            evaluated = evaluated.slice(1, -1);
                            evaluated = evaluated.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
                            
                            // Interpolation de variables dans les chaînes
                            evaluated = evaluated.replace(/\$(\w+)/g, (match, varName) => {
                                return variables.hasOwnProperty(varName) ? variables[varName] : match;
                            });
                            
                            result += evaluated;
                        }
                        // Variables
                        else if (evaluated.startsWith('$')) {
                            const varName = evaluated.replace('$', '');
                            result += variables.hasOwnProperty(varName) ? variables[varName] : '';
                        }
                        // Expressions
                        else {
                            const evalResult = evalExpression(evaluated);
                            result += evalResult !== undefined ? evalResult : '';
                        }
                    }
                    
                    output += result;
                }
                
                // Gestion des affectations de variables
                else if (line.match(/^\$(\w+)\s*=/)) {
                    const match = line.match(/^\$(\w+)\s*=\s*(.+?);?$/);
                    if (match) {
                        const varName = match[1];
                        let value = match[2].replace(/;$/, '').trim();
                        
                        // Tableaux
                        if (value.startsWith('[') && value.endsWith(']')) {
                            try {
                                value = value.replace(/=>/g, ':');
                                variables[varName] = JSON.parse(value);
                            } catch {
                                variables[varName] = [];
                            }
                        }
                        // Chaînes
                        else if ((value.startsWith('"') && value.endsWith('"')) || 
                                 (value.startsWith("'") && value.endsWith("'"))) {
                            variables[varName] = value.slice(1, -1).replace(/\\n/g, '\n');
                        }
                        // Booléens
                        else if (value === 'true') {
                            variables[varName] = true;
                        } else if (value === 'false') {
                            variables[varName] = false;
                        }
                        // Nombres et expressions
                        else {
                            variables[varName] = evalExpression(value);
                        }
                    }
                }
            }
            
            return output || '(Aucune sortie)';
        }

        // Resize functionality
        let isResizing = false;
        const resizeHandle = document.getElementById('resizeHandle');
        const consoleSection = document.getElementById('consoleSection');

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'ns-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const windowHeight = window.innerHeight;
            const newHeight = windowHeight - e.clientY - 22; // 22 is status bar height
            
            if (newHeight >= 100 && newHeight <= windowHeight - 200) {
                consoleSection.style.height = newHeight + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = 'default';
        });

        // Auto-run on load
        window.addEventListener('load', () => {
            runCode();
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                runCode();
            }
            if (e.key === 'F5') {
                e.preventDefault();
                runCode();
            }
        });

