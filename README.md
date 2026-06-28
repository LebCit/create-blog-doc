# Blog-Doc

**The Simplest Node.js CMS & SSG**  
A tiny flame in the darkness of error...

---

## What is this?

This is the initializer package for [Blog-Doc](https://github.com/LebCit/blog-doc), a local Markdown CMS and static site generator built on Node.js.

Run a single command and you have a working project on your machine — write content in Markdown, manage it through a clean admin interface, and build a complete static site ready to deploy anywhere.

---

## Requirements

- [Node.js](https://nodejs.org/en) v18 or later (LTS recommended)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (latest version recommended)

---

## Installation

Open a terminal in the directory where you want to create your project and run one of the following:

### Using `npx`

```bash
npx create-blog-doc my-blog
```

### Using `npm init`

```bash
npm init blog-doc my-blog
```

Replace `my-blog` with whatever you want your project folder to be named.

This will clone the Blog-Doc repository into that folder and install all dependencies automatically.

---

## Getting started

Once installation is complete, navigate into your project folder and start the app:

```bash
cd my-blog
npm start
```

Then open your browser:

| URL                           | What's there      |
| ----------------------------- | ----------------- |
| `http://localhost:3000`       | Live site preview |
| `http://localhost:3000/admin` | Admin interface   |

Create your own content through the admin interface.

---

## Updating

To update Blog-Doc to the latest version at any time, run this from inside your project folder:

```bash
npm run update
```

Your content, settings, and installed themes are never affected by updates.

---

## Further reading

Full documentation is available at [blog-doc.pages.dev](https://blog-doc.pages.dev/).

---

See you around!  
[LebCit](https://lebcit.github.io/)
