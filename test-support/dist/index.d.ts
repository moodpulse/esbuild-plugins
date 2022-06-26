import { OutputFile } from 'esbuild';
export declare function writeFiles(graph: {
    [name: string]: string;
}): Promise<{
    unlink: () => void;
    paths: string[];
    base: string;
}>;
export declare function randomOutputFile(extension?: string): string;
export declare function formatEsbuildOutput(res: {
    outputFiles?: OutputFile[];
}): string;
//# sourceMappingURL=index.d.ts.map