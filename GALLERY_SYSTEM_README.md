# Portfolio Gallery System

This portfolio now includes a flexible gallery system that supports three different display modes for project images.

## Gallery Modes

### 1. None (`'none'`)
- Shows only the cover image
- Displays a message: "No additional images to display."

### 2. Slideshow (`'slideshow'`)
- Displays images in a slideshow format with navigation
- Includes previous/next buttons and dot navigation
- Images are shown one at a time with smooth transitions

### 3. Gallery (`'gallery'`)
- Displays all images in a responsive grid layout
- Each image has a caption below it
- Best for showing multiple images at once

## How to Use

### For New Projects

1. **Create your project folder** in the appropriate category:
   ```
   projects/[category]/[project-name]/
   ```

2. **Add your images** to the project folder:
   - `cover.jpg` - Main cover image (required)
   - `screenshot1.jpg`, `screenshot2.jpg`, etc. - Additional images

3. **Configure the gallery** by editing the JavaScript in your project's `index.html`:

```javascript
const galleryData = {
  mode: 'gallery', // 'none', 'slideshow', or 'gallery'
  images: [
    { src: 'screenshot1.jpg', caption: 'Main gameplay' },
    { src: 'screenshot2.jpg', caption: 'Eco-friendly interface' },
    { src: 'screenshot3.jpg', caption: 'Upgrade system' }
  ]
};
```

### Gallery Data Structure

```javascript
{
  mode: 'gallery', // Display mode
  images: [
    {
      src: 'filename.jpg',     // Image filename
      caption: 'Description'    // Image caption
    }
  ]
}
```

### Adding to JSON Data

Update the appropriate JSON file in `data/` folder:

```json
{
  "title": "Project Name",
  "url": "../projects/category/project-name/index.html",
  "description": "Project description",
  "image": "../projects/category/project-name/cover.jpg"
}
```

## Project Structure

```
projects/
├── game-design/
│   ├── verdant-clicker/
│   │   ├── index.html
│   │   ├── cover.jpg
│   │   ├── screenshot1.jpg
│   │   └── screenshot2.jpg
│   └── glitch-bound/
│       ├── index.html
│       └── cover.jpg
├── graphic-design/
│   └── sample-project/
│       ├── index.html
│       └── cover.jpg
├── web-design/
│   └── portfolio-v2/
│       ├── index.html
│       └── cover.jpg
└── ux-ui/
    └── EmPow/
        ├── index.html
        ├── Cover.png
        └── WireFrame.png
```

## Features

- **Responsive Design**: Gallery adapts to different screen sizes
- **Error Handling**: Shows placeholder when images are missing
- **Smooth Transitions**: Slideshow includes smooth navigation
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Easy Configuration**: Simple JavaScript configuration

## Template Files

Use the existing project templates as a starting point:
- `projects/game-design/verdant-clicker/index.html` - Game design template
- `projects/graphic-design/sample-project/index.html` - Graphic design template
- `projects/game-design/glitch-bound/index.html` - Template for new projects

## Navigation Fix

The navigation issue has been fixed by updating all project URLs in the JSON files to use the correct relative paths (`../projects/`) when accessed from the `pages/` folder.
