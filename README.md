<p align="center">
<img src="https://api.iconify.design/fluent:resize-image-20-filled.svg?color=%2358a6ff" alt="logo" width='100'/>
</p>

<p align="center">
  An advanced image resize plugin for <a href="https://quilljs.com/" target="_blank" rel="noopener noreferrer">Quill</a> editor with improved positioning and responsiveness.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@lokesh-stack/advanced-quill-image-resize" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@lokesh-stack/advanced-quill-image-resize.svg" alt="NPM Version" /></a>
  <a href="https://github.com/lokesh-stack/advanced-quill-image-resize/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
</p>

## Features

- ✨ **Improved Scroll Handling** - Toolbar and dropdowns stay properly positioned during editor and document scrolling
- 🖼️ **Image Resizing** with drag handles
- 🔄 **Image Alignment** (left, center, right)
- 📝 **Text Wrapping** around images (left or right)
- 🎨 **Border Customization** (width, color)
- 🔗 **Image Actions** (copy, link, delete)

## Install

```bash
npm i @lokesh-stack/advanced-quill-image-resize
```

With `yarn`

```bash
yarn add @lokesh-stack/advanced-quill-image-resize
```

With `pnpm`

```bash
pnpm add @lokesh-stack/advanced-quill-image-resize
```

## Reactjs

```tsx
import ReactQuill, { Quill } from 'react-quill';
import QuillResizeImage from '@lokesh-stack/advanced-quill-image-resize';

/**
- add object resize to modules.
**/

// resize: {
//   locale: {},
// },


Quill.register("modules/resize", window.QuillResizeImage);

const App = () => {
  const Editor = {
      modules: {
        toolbar: {
          container: [
            ['image'],
          ],
        },
        resize: {
          locale: {},
        },
      },
      formats: [
        'image',
      ],
    };

  return <ReactQuill
      modules={Editor.modules}
      formats={Editor.formats}
      theme='snow'
    />
}

```

## Browser

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      crossorigin="anonymous"
      integrity="sha384-7kltdnODhBho8GSWnwD9l9rilXkpuia4Anp4TKHPOrp8/MS/+083g4it4MYED/hc"
      href="http://lib.baomitu.com/quill/2.0.0-dev.3/quill.snow.min.css"
      rel="stylesheet"
    />
    <script
      crossorigin="anonymous"
      integrity="sha384-MDio1/ps0nK1tabxUqZ+1w2NM9faPltR1mDqXcNleeuiSi0KBXqIsWofIp4r5A0+"
      src="http://lib.baomitu.com/quill/2.0.0-dev.3/quill.min.js"
    ></script>
       <!-- For this version, please use npm installation method or host the files yourself -->
    <!-- <script defer src="path-to-your-hosted-version/quill-resize-image.min.js"></script> -->
  </head>
  <body>
    <div id="editor">
      <p>Hello World!</p>
      <p>Some initial <strong>bold</strong> text</p>
      <p><br /></p>
    </div>
  </body>
  <script>
    Quill.register("modules/resize", window.QuillResizeImage);

    var toolbarOptions = [
      "bold",
      "italic",
      "underline",
      "strike",
      "image",
      "video",
    ];
    var quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
        resize: {
          locale: {
            center: "center",
          },
        },
      },
    });
  </script>
</html>
```
