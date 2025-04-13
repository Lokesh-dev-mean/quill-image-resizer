<p align="center">
<img src="https://api.iconify.design/fluent:resize-image-20-filled.svg?color=%2358a6ff" alt="Quill Image Pro - Advanced image toolkit for Quill Editor" width='100'/>
</p>

<h1 align="center">Quill Image Pro</h1>

<p align="center">
  The most comprehensive image management toolkit for <a href="https://quilljs.com/" target="_blank" rel="noopener noreferrer">Quill</a> editor with responsive resizing, smart alignment, text wrapping, and advanced image tools.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@lokesh-stack/quill-image-pro" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@lokesh-stack/quill-image-pro.svg" alt="NPM Version" /></a>
  <a href="https://github.com/lokesh-stack/quill-image-pro/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <a href="https://github.com/lokesh-stack/quill-image-pro/stargazers" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/github/stars/lokesh-stack/quill-image-pro.svg?style=social" alt="GitHub Stars" /></a>
</p>

## Features

- ✨ **Improved Scroll Handling** - Toolbar and dropdowns stay properly positioned during editor and document scrolling
- 🖼️ **Responsive Image Resizing** with smart resize handles that adapt to image alignment
- 🔄 **Image Alignment** (left, center, right) with intuitive visual feedback
- 📝 **Text Wrapping** around images (left or right) for better content flow
- 🎨 **Border Customization** (width, color) with live preview
- 🔗 **Image Actions** (copy, link, alt text, delete) for complete image management
- ⚙️ **Highly Customizable** - Configure which controls appear in the toolbar to match your needs
- 🌐 **i18n Support** - Easy localization for all UI elements

## Why Choose Quill Image Pro?

Quill Image Pro elevates your rich text editing experience with its intuitive image management capabilities. Whether you're building a blog platform, CMS, or any content creation tool, this plugin delivers professional image handling that your users will love.

### Key Advantages

- **Smart Resize Handles**: Handles intelligently adapt to image alignment states
- **Aspect Ratio Preservation**: Maintains image proportions during resizing
- **Framework Agnostic**: Works seamlessly with React, Angular, Vue, and vanilla JS
- **Mobile-Friendly**: Responsive design works across all device sizes
- **Accessibility**: ARIA compliant with keyboard navigation support
- **Extensive Documentation**: Comprehensive examples for all frameworks

## Installation

With `npm`:

```bash
npm install @lokesh-stack/quill-image-pro
```

With `yarn`:

```bash
yarn add @lokesh-stack/quill-image-pro
```

With `pnpm`:

```bash
pnpm add @lokesh-stack/quill-image-pro
```

## Usage Examples

### React

```jsx
import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import '@lokesh-stack/quill-image-pro/dist/quill-resize-image.min.css';
import QuillResizeImage from '@lokesh-stack/quill-image-pro';

// Register the module
Quill.register('modules/resize', QuillResizeImage);

function QuillEditor() {
  const quillRef = useRef(null);
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['image', 'link'],
    ],
    resize: {
      // You can provide custom locale strings
      locale: {
        altTip: 'Alt text',
        floatLeft: 'Float left',
        floatRight: 'Float right',
        center: 'Center',
        left: 'Left',
        right: 'Right',
      },
      // Configure which buttons to show in the toolbar
      toolbar: {
        border: true,          // Show border controls
        align: true,           // Show alignment buttons
        wrap: true,            // Show text wrapping buttons
        imageActions: {
          copy: true,          // Show copy button
          link: true,          // Show add link button
          altText: true,       // Show alt text button
          delete: true         // Show delete button
        }
      }
    }
  };

  return (
    <div className="editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        placeholder="Write something..."
      />
    </div>
  );
}

export default QuillEditor;
```

### Angular

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';
import { AppComponent } from './app.component';

// Import the CSS files
import 'quill/dist/quill.snow.css';
import '@lokesh-stack/quill-image-pro/dist/quill-resize-image.min.css';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import Quill from 'quill';
import QuillResizeImage from '@lokesh-stack/quill-image-pro';

// Register the resize module
Quill.register('modules/resize', QuillResizeImage);

@Component({
  selector: 'app-root',
  template: `
    <quill-editor
      [styles]="{height: '300px'}"
      [modules]="quillModules"
      placeholder="Write your content here..."
    ></quill-editor>
  `
})
export class AppComponent implements OnInit {
  quillModules = {};

  ngOnInit() {
    this.quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['image', 'link']
      ],
      resize: {
        locale: {
          altTip: 'Alt text',
          floatLeft: 'Float left',
          floatRight: 'Float right',
          center: 'Center',
          left: 'Left',
          right: 'Right',
        },
        toolbar: {
          border: true,
          align: true,
          wrap: true,
          imageActions: {
            copy: true,
            link: true,
            altText: true,
            delete: true
          }
        }
      }
    };
  }
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Quill Image Resize Example</title>
  
  <!-- Include Quill stylesheet -->
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
  
  <!-- Include the image resize plugin CSS -->
  <link href="path/to/@lokesh-stack/quill-image-pro/dist/quill-resize-image.min.css" rel="stylesheet">
</head>
<body>
  <div id="editor">
    <p>Hello World!</p>
    <p>Add an image and resize it with our advanced controls!</p>
  </div>

  <!-- Include Quill library -->
  <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
  
  <!-- Include the image resize plugin -->
  <script src="path/to/@lokesh-stack/quill-image-pro/dist/quill-resize-image.min.js"></script>
  
  <script>
    // Register the module with Quill
    Quill.register('modules/resize', QuillResizeImage);

    // Initialize Quill editor
    const quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['image', 'link']
        ],
        resize: {
          // Custom locale strings
          locale: {
            altTip: 'Alternative Text',
            floatLeft: 'Wrap with text (left)',
            floatRight: 'Wrap with text (right)',
            center: 'Center align',
            left: 'Left align',
            right: 'Right align'
          },
          // Configure toolbar options
          toolbar: {
            border: true,        // Show border controls
            align: true,         // Show alignment buttons
            wrap: true,          // Show text wrapping buttons
            imageActions: {
              copy: true,        // Show copy button
              link: true,        // Show add link button
              altText: true,     // Show alt text button
              delete: true       // Show delete button
            }
          },
          // Optional callback when image is changed
          onChange: function(image) {
            console.log('Image changed:', image);
          }
        }
      },
      placeholder: 'Compose an epic story...'
    });
  </script>
</body>
</html>
```

## Configuration Options

### Resize Module Options

| Option | Type | Description |
|--------|------|-------------|
| `locale` | Object | Customize the text strings used in the UI |
| `toolbar` | Object | Configure which buttons appear in the toolbar |
| `toolbar.border` | Boolean | Show/hide border controls |
| `toolbar.align` | Boolean | Show/hide alignment buttons |
| `toolbar.wrap` | Boolean | Show/hide text wrapping buttons |
| `toolbar.imageActions` | Object | Configure image action buttons |
| `toolbar.imageActions.copy` | Boolean | Show/hide copy button |
| `toolbar.imageActions.link` | Boolean | Show/hide link button |
| `toolbar.imageActions.altText` | Boolean | Show/hide alt text button |
| `toolbar.imageActions.delete` | Boolean | Show/hide delete button |
| `onChange` | Function | Callback when image is changed |

## Browser Support

The plugin is tested and works in all modern browsers (Chrome, Firefox, Safari, Edge).
