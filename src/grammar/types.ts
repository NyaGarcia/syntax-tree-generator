import { NonTerminal } from "./symbols/non-terminal";
import { Terminal } from "./symbols/terminal";

export type Rule = (Terminal | NonTerminal)[];