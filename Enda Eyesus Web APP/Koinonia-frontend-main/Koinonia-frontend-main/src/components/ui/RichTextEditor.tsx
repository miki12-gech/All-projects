//src/components/ui/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from './button';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Type your content..." }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#F5F5F5]',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, active, children }: { onClick: () => void; active: boolean; children: React.ReactNode }) => (
        <Button
            type="button"
            onClick={onClick}
            variant={active ? "default" : "outline"}
            size="sm"
            className={`h-8 w-8 p-0 ${active ? 'bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F]' : 'text-[#6b6b6b] dark:text-[#B0B0B0]'}`}
        >
            {children}
        </Button>
    );

    return (
        <div className="border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl overflow-hidden bg-[#F8F5F0] dark:bg-[#252529]">
            <div className="flex items-center gap-1 p-2 border-b border-[#ddd8d0] dark:border-[#2a2a2d] bg-white dark:bg-[#1C1C1F]">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
