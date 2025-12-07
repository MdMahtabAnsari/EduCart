import { CodeBlockLowlight as TiptapCodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import type { CodeBlockLowlightOptions } from "@tiptap/extension-code-block-lowlight"

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addOptions(): CodeBlockLowlightOptions {
    return {
      ...this.parent?.(),

      // required fields
      languageClassPrefix: "language-",
      lowlight: createLowlight(common),
      defaultLanguage: null,
      HTMLAttributes: {
        class: "block-node",
      },

      // required bools
      exitOnTripleEnter: true,
      exitOnArrowDown: true,

      // required numbers
      tabSize: 2,

      // NEW required field from your error
      enableTabIndentation: true,
    }
  },
})

export default CodeBlockLowlight
