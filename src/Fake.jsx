import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';
import parse from 'html-react-parser';

import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import FileHandler from '@tiptap-pro/extension-file-handler';

import { Icons } from './components/icons';

const TextEditor = () => {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5],
                },
            }),
            Image.configure({
                inline: true,
            }),
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach(file => {
                        const fileReader = new FileReader()

                        fileReader.readAsDataURL(file)
                        fileReader.onload = () => {
                            currentEditor.chain().insertContentAt(pos, {
                                type: 'image',
                                attrs: {
                                    src: fileReader.result,
                                },
                            }).focus().run()
                        }
                    })
                },
                onPaste: (currentEditor, files, htmlContent) => {
                    files.forEach(file => {
                        if (htmlContent) {
                            console.log(htmlContent)
                            return false
                        }

                        const fileReader = new FileReader()

                        fileReader.readAsDataURL(file)
                        fileReader.onload = () => {
                            currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                                type: 'image',
                                attrs: {
                                    src: fileReader.result,
                                },
                            }).focus().run()
                        }
                    })
                },
            }),
            CharacterCount,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Superscript,
            Subscript,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Highlight.configure({
                multicolor: true
            }),
            Color,
            TextStyle,
            FontFamily,
        ],
        content: "",
    });

    const [isEditable, setIsEditable] = useState(true);


    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable)
        }
    }, [isEditable, editor])

    const addImage = useCallback(() => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
        if (url === null) {
            return
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor]);

    if (!editor) {
        return null
    }

    const hanldeCopy = () => {
        const html = editor.getHTML();
        console.log(html)
        navigator.clipboard.writeText(html);
    }

    return (
        <div className='container'>
            <div>
                <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)} />
                Editable
            </div>
            <div className='editor'>
                <div>
                    <input
                        type="color"
                        onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
                        value={editor.getAttributes('textStyle').color}
                        data-testid="setColor"
                    />
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                        <Icons.bold />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        <Icons.italic />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}
                    >
                        <Icons.strikethrough />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <Icons.ul />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <Icons.ol />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                    >
                        <Icons.h1 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                        <Icons.h2 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                    >
                        <Icons.h3 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
                    >
                        <Icons.h4 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
                    >
                        <Icons.h5 />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'is-active' : ''}
                    >
                        <Icons.underline />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                    >
                        <Icons.alignLeft />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                    >
                        <Icons.alignCenter />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                    >
                        <Icons.alignRight />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                    >
                        <Icons.alignJustify />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={editor.isActive('superscript') ? 'is-active' : ''}
                    >
                        <Icons.superscript />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={editor.isActive('subscript') ? 'is-active' : ''}
                    >
                        <Icons.subscript />
                    </button>
                    <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
                        <Icons.link />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        disabled={!editor.isActive('link')}
                    >
                        <Icons.unlink />
                    </button>
                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                        <Icons.undo />
                    </button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                        <Icons.redo />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={editor.isActive('codeBlock') ? 'is-active' : ''}
                    >
                        <Icons.codeblock />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={editor.isActive('code') ? 'is-active' : ''}
                    >
                        <Icons.code />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <Icons.blockquote />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()}
                        className={editor.isActive('highlight') ? 'is-active' : ''}
                    >
                        <Icons.bg />
                    </button>
                    <button onClick={addImage}>
                        <Icons.image />
                    </button>
                    <div>
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('Inter').run()}
                            className={editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''}
                        >
                            Inter
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()}
                            className={
                                editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' })
                                    ? 'is-active'
                                    : ''
                            }
                        >
                            Comic Sans
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('serif').run()}
                            className={editor.isActive('textStyle', { fontFamily: 'serif' }) ? 'is-active' : ''}
                        >
                            Serif
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('monospace').run()}
                            className={editor.isActive('textStyle', { fontFamily: 'monospace' }) ? 'is-active' : ''}
                        >
                            Monospace
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setFontFamily('cursive').run()}
                            className={editor.isActive('textStyle', { fontFamily: 'cursive' }) ? 'is-active' : ''}
                        >
                            Cursive
                        </button>
                        <button onClick={() => editor.chain().focus().unsetFontFamily().run()}>
                            Unset
                        </button>
                    </div>
                </div>
                <EditorContent editor={editor} />
            </div>
            <button onClick={hanldeCopy}>Copy HTML</button>
        </div>
    )
}

export default TextEditor;