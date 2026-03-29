<div align="center">

# pb.adt

**Simple ADT types for values as plain objects.**

[Install](#install) • [Usage](#usage) ([Types](#types) • [Values](#values) •
[Narrowing](#narrowing) • [Type Guard](#type-guard) • [Keys](#keys) •
[Subtyping](#subtyping))

</div>

# Install

```shell
npm install pb.adt
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`

# Usage

## Types


```ts
import type { ADT } from "pb.adt";
```


The `ADT` **type** defines discriminated union types:


```ts
export type Post =
  | ADT<"Ping">
  | ADT<"Text", { title?: string; body: string }>
  | ADT<"Photo" | "Video", { url: string }>;
```


This is identical to defining the discriminated union manually:


```ts
export type Post =
  | { $type: "Ping" }
  | { $type: "Text"; title?: string; body: string }
  | { $type: "Photo"; url: string }
  | { $type: "Video"; url: string };
```


## Values

The `ADT` **function** can define a values "builder" from a given ADT type:


```ts
import { ADT } from "pb.adt";
```



```ts
export const Post = ADT<Post>();

const posts: Array<Post> = [
  Post.Ping(),
  Post.Text({ body: "Hello, World!" }),
  Post.Photo({ url: "https://example.com/image.jpg" }),
  Post.Video({ url: "https://example.com/video.mp4" }),
];
```



```ts
const posts: Array<Post> = [
  ADT<Post>().Ping(),
  ADT<Post>().Text({ body: "Hello, World!" }),
  ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
  ADT<Post>().Video({ url: "https://example.com/video.mp4" }),
];
```


## Narrowing

Use the `$type` property can be used to discriminate in `if` and `switch`
statements:


```ts
function handlePost(post: Post) {
  if (post.$type === "Ping") {
    post; // { $type: "Ping", ... }
  } else {
    post; // { $type: "Text", ... } | { $type: "Photo", ... } | { $type: "Video", ... }
  }

  switch (post.$type) {
    case "Ping": {
      post; // { $type: "Ping", ... }
      break;
    }
    case "Text": {
      post; // { $type: "Text", ... }
      break;
    }
    default: {
      post; // { $type: "Photo", ... } | { $type: "Video", ... }
      break;
    }
  }
}
```


## Type Guard

The `ADT` **function** can also type-guard for an ADT value:


```ts
function handleValue(value: Post | Other): void {
  if (ADT(value)) {
    value; // Post
  } else {
    value; // Other
  }

  if (ADT(value) && value.$type === "Ping") {
    value; // { $type: "Ping", ... }
  } else {
    value; // Other | { $type: "Text", ... } | { $type: "Photo", ... } | { $type: "Video", ... }
  }
}
```


## Keys

Use `T['$type']` to get an ADT's discriminant types:


```ts
type Types = Post["$type"];
// "Ping" | "Text" | "Photo" | "Video"
```


## Subtyping

Use `Extract` and `Exclude` to "pick" and "omit" matching ADT variants:


```ts
type Text = Extract<Post, ADT<"Text">>;
// { $type: "Text", ... }

type Media = Extract<Post, { url: string }>;
// { $type: "Photo", ... } | { $type: "Video", ... }

type NotText = Exclude<Post, ADT<"Text">>;
// { $type: "Ping", ... } | { $type: "Photo", ... } | { $type: "Video", ... }

type NotUrls = Exclude<Post, { url: string }>;
// { $type: "Ping", ... } | { $type: "Text", ... }
```

