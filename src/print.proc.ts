import * as readline from "readline";

 const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

export function printCommands(message: string, options?: any[]): boolean {
    if(options) {
        console.log(message, options);
    } else {
        console.log(message)
    }
        
    return true;
}

export async function askSomthing(
    question: string,
    defaultValue?: string
): Promise<string> {
    return new Promise((resolve) => {
        this.rl.question(question, (aw) => {
            resolve(
                aw && aw.length > 0 ? aw : defaultValue ? defaultValue : ""
            );
        });
    });
}