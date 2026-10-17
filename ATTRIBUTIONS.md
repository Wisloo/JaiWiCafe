# Image Attributions

Menu photography is sourced from [Unsplash](https://unsplash.com) and bundled
locally in `public/menu/` so the app works offline.

Unsplash images are free to use under the
[Unsplash License](https://unsplash.com/license) (commercial use allowed, no
attribution required). Credit is provided below as good practice.

| Menu item | Local file | Source |
| --- | --- | --- |
| Aloha Espresso | `aloha-espresso.jpg` | https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04 |
| JaiWi Latte | `jaiwi-latte.jpg` | https://images.unsplash.com/photo-1561882468-9110e03e0f78 |
| Cold Brew | `cold-brew.jpg` | https://images.unsplash.com/photo-1558122104-355edad709f6 |
| Cortado | `cortado.jpg` | https://images.unsplash.com/photo-1572442388796-11668a67e53d |
| Hibiscus Iced Tea | `hibiscus-iced-tea.jpg` | https://images.unsplash.com/photo-1558160074-4d7d8bdf4256 |
| Matcha Sunrise | `matcha-sunrise.jpg` | https://images.unsplash.com/photo-1515823064-d6e0c04616a7 |
| Spiced Chai | `spiced-chai.jpg` | https://images.unsplash.com/photo-1576092768241-dec231879fc3 |
| Butter Croissant | `butter-croissant.jpg` | https://images.unsplash.com/photo-1550617931-e17a7b70dce2 |
| Ube Malasada | `ube-malasada.jpg` | https://images.unsplash.com/photo-1486427944299-d1955d23e34d |
| Banana Bread | `banana-bread.jpg` | https://images.unsplash.com/photo-1576618148400-f54bed99fcfd |

## Re-downloading

To refresh or restore the bundled images:

```sh
npm run images:download
```

The script reads the `photo` id from each item in `src/data/menu.js` and writes
`public/menu/<slug>.jpg`. Existing files are skipped, so it only downloads what
is missing. Delete a file (or the whole `public/menu/` folder) to force a fresh
download.
