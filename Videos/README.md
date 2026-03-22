# Video Upload Guide

This portfolio is a static site, so videos are added by placing files in this folder and referencing them from `Index.html`.

## Recommended format

- Use `.mp4` with H.264 video for the widest browser support.
- Keep clips short when possible.
- Aim for compressed files so the page still loads quickly on GitHub Pages.

## Example HTML

Replace the placeholder card in the `UE5 shaders` section with this block:

```html
<article class="video-card">
    <div class="video-card__media">
        <video controls preload="metadata" playsinline poster="Img/Shade1.gif">
            <source src="Videos/ue5-shader-demo.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="video-card__content">
        <h3>Molten crystal material</h3>
        <p>Short description of the shader goal, technique, and engine version.</p>
    </div>
</article>
```

## Upload steps

1. Copy your exported video into `Videos/`.
2. Use a simple filename such as `ue5-shader-demo.mp4`.
3. Update the `src` path in `Index.html` to match the file.
4. Commit and push the video together with the HTML change.

## Multiple videos

Duplicate the `<article class="video-card">...</article>` block for each new shader clip.
