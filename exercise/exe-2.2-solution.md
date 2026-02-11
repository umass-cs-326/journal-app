# Exercise 2.2 Solution — Add a Journal Entry Search Form by ID

This solution adds a complete search flow so a user can type an entry ID in a form and then view that entry page. The work touches three files: one new HTML file and two TypeScript files. The new file is `static/search-form.html:1`, and the updated files are `src/app.ts:33` and `src/controller/JournalController.ts:7`.

The first part of the solution is the new static page at `static/search-form.html:1`. This page gives users a simple interface for entering an ID and submitting it to the server. The important detail is that the text input is named `id`, because the server reads `req.body.id` from submitted form data.

```html
<h1>Search Journal Entries</h1>
<form action="/entries/search" method="POST">
  <label for="id">Entry ID</label>
  <input id="id" name="id" type="text" required />
  <button type="submit">Search</button>
</form>
```

The next part is routing in `src/app.ts`. At `src/app.ts:55`, a new `GET /entries/search` route serves the search form page through the controller. At `src/app.ts:60`, a new `POST /entries/search` route parses URL-encoded form data and reads the submitted `id`. Instead of rebuilding entry lookup logic, the code redirects to the existing route pattern `/entries/:id`, which keeps the app design simple and reusable.

```ts
this.app.get("/entries/search", (_req: Request, res: Response) =>
  showSearchForm(res)
);

this.app.post("/entries/search", express.urlencoded({ extended: true }), (req: Request, res: Response) => {
  const id = req.body.id;
  res.redirect(`/entries/${id}`);
});
```

To support this route cleanly, `src/controller/JournalController.ts` was extended. The interface now includes `showSearchForm` at `src/controller/JournalController.ts:7`, and the implementation at `src/controller/JournalController.ts:24` sends the new static file. This matches the existing controller style used for home and entry form pages.

```ts
showSearchForm(res: Response): void {
  res.sendFile("search-form.html", { root: "static" });
}
```

The final change improves navigation when an entry page is displayed. In `src/controller/JournalController.ts:44` and `src/controller/JournalController.ts:47`, the HTML now includes a “Back to Search” link for both the “entry found” and “not found” cases. This makes the search workflow repeatable without manually editing the URL.

```ts
let html = '<h1>Journal Entry Not Found</h1><a href="/entries/search">Back to Search</a>';
const entry = this.service.getEntry(id);
if (entry) {
  html = `<h1>Journal Entry</h1><p>${entry.content}</p><a href="/entries/search">Back to Search</a>`;
}
res.send(html);
```

There are a few important concepts introduced here. The first is HTML form submission: the browser sends form values as request data when the user clicks submit. The second is middleware for form parsing: `express.urlencoded({ extended: true })` is needed so `req.body` contains submitted form fields. The third is redirect-based flow: after receiving an ID, the app redirects to an existing route (`/entries/:id`) instead of duplicating lookup code. The fourth is keeping responsibilities organized: route definitions stay in `app.ts`, while page-serving and response-building logic stays in the controller.

After completing this exercise, the most important thing to understand is how one user action can travel through the full request/response pipeline. A user loads a form page, submits data, the server reads and interprets that data, then the server responds using existing application behavior. If you understand that pipeline, you can build many similar features by combining static pages, route handlers, middleware, and controller methods in a consistent way.
