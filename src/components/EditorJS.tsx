"use client";
import { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import type { ToolConstructable } from "@editorjs/editorjs";

interface EditorJsProps {
    initialData?: OutputData;
    onChange?: (data: OutputData) => void;
}

const TOOLS: { [toolName: string]: ToolConstructable | object } = {
    paragraph: {
        class: Paragraph as unknown as ToolConstructable,
        inlineToolbar: true,
    },
    header: {
        class: Header as unknown as ToolConstructable,
        inlineToolbar: true,
    },
    list: {
        class: List as unknown as ToolConstructable,
        inlineToolbar: true,
    },
    checklist: {
        class: Checklist as unknown as ToolConstructable,
        inlineToolbar: true,
    },
    quote: {
        class: Quote as unknown as ToolConstructable,
        inlineToolbar: true,
    },
};

export default function EditorJs({ initialData, onChange }: EditorJsProps) {
    const editorRef = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: "editorjs",
                autofocus: true,
                data: initialData ?? { blocks: [] },
                tools: TOOLS,
                onChange: async () => {
                    const data = await editor.save();
                    onChange?.(data);
                },
            });

            editorRef.current = editor;
        }

        return () => {
            editorRef.current?.destroy?.();
            editorRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div id="editorjs" className="min-h-[300px] border rounded-md p-4 bg-white" />
    );
}