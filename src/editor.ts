import { readFileSync, writeFileSync } from "node:fs";

export class TextEditor {
    private text: string[];
    private cursorX: number;
    private cursorY: number;
    private filename: string;

    constructor() {
        this.text = []
        this.cursorX = 0;
        this.cursorY = 0;
        this.filename = '';
    }

    moveCursor(dx: number, dy: number) {
        this.cursorX = Math.max(0, Math.min(this.text[this.cursorY]?.length || 0, this.cursorX + dx));
        this.cursorY = Math.max(0, Math.min(this.text.length - 1, this.cursorY + dy));
    }

    insertText(char: string) {
        const line = this.text[this.cursorY];
        this.text[this.cursorY] = line.slice(0, this.cursorX) + char + line.slice(this.cursorX);
        this.cursorX += 1;
    }

    deleteText() {
        const line = this.text[this.cursorY];
        this.text[this.cursorY] = line.slice(0, this.cursorX - 1) + line.slice(this.cursorX);
        this.cursorX = Math.max(0, this.cursorX - 1);

        if (this.cursorX === 0 && this.cursorY > 0) {
            const currentLine = this.text[this.cursorY];
            this.text.splice(this.cursorY, 1);
            this.cursorY -= 1;
            this.cursorX = this.text[this.cursorY].length;
            this.text[this.cursorY] += currentLine;
        }
    }

    insertNewLine() {
        const line = this.text[this.cursorY];
        const before = line.slice(0, this.cursorX);
        const after = line.slice(this.cursorX);
        this.text[this.cursorY] = before;
        this.text.splice(this.cursorY + 1, 0, after);
        this.cursorY += 1;
        this.cursorX = 0;
    }

    view() {
        console.clear();
        this.text.forEach((line, index) => {
            if (index === this.cursorY) {
                console.log(line.slice(0, this.cursorX) + '|' + line.slice(this.cursorX));
            } else {
                console.log(line);
            }
        });
    }

    open(filename: string) {
        this.filename = filename;
        const content = readFileSync(filename, 'utf8');
        this.text = content.split('\n');
        process.stdout.write(`File opened: ${this.text}\n`);
    }

    save() {
        const content = this.text.join('\n');
        writeFileSync(this.filename, content);
        process.stdout.write(`File saved\n`);
        process.exit(0);
    }
}
