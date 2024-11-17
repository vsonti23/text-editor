import { TextEditor } from './editor';
import { createInterface } from 'readline';

// Initialize the text editor
const textEditor = new TextEditor();

// Create a readline interface
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Set raw mode for keypress handling
process.stdin.setRawMode(true);
process.stdin.resume();

// Display a basic menu
console.log("Welcome to the Text Editor!");
console.log("Commands:");
console.log("  - o: Open a file");
console.log("  - q: Quit\n");

function openFilePrompt() {
    process.stdin.setRawMode(false);

    rl.question('Enter the filename to open: ', (filename) => {
        filename = filename.trim().slice(0, -1)

        if (!filename) {
            console.log('Error: No filename provided');
        } else {
            try {
                textEditor.open(filename);
                console.log(`Successfully opened file: ${filename}`);
                textEditor.view();
            } catch (error) {
                console.log(`Failed to open file: ${error}`);
            }
        }
        process.stdin.setRawMode(true);

    });

}

// Handle keypress events in raw mode
process.stdin.on('data', (chunk) => {
    const key = chunk.toString();

    switch (key) {
        case 'o': // Command to open a file
            openFilePrompt(); // Prompt for file input
            break;

        case 'q': // Quit command
            rl.close(); // Exit readline
            process.exit(0);
            break;



        // Arrow keys for cursor movement
        case '\u001b[A': // Up arrow
            textEditor.moveCursor(0, -1);
            break;
        case '\u001b[B': // Down arrow
            textEditor.moveCursor(0, 1);
            break;
        case '\u001b[D': // Left arrow
            textEditor.moveCursor(-1, 0);
            break;
        case '\u001b[C': // Right arrow
            textEditor.moveCursor(1, 0);
            break;

        case '\u007f': // Handle Backspace
            textEditor.deleteText(); // Implement the logic in your edistor
            break

        case '\u0013': { // Ctrl + S
            textEditor.save()
            break
        }

        // Enter key (newline)
        case '\u000d':
            textEditor.insertNewLine();

        default:
            // Handle regular typing (insert text)
            textEditor.insertText(key);
    }

    // Render the updated editor view (except during file prompts)
    if (key !== 'o') {
        textEditor.view();
    }
});
