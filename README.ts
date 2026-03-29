/*!
<div align="center">

# pb.adt

**Simple ADT types for values as plain objects.**

[Install](#install) • [Usage](#usage) ([Types](#types) • [Values](#values) •
[Narrowing](#narrowing) • [Type Guard](#type-guard) • [Keys](#keys) •
[Subtyping](#subtyping))

</div>
!*/

//+ # Install

/*!
```shell
npm install pb.adt
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`
!*/

//+ # Usage

//+ ## Types

//>
//+ import type { ADT } from "pb.adt";
//<

/*!
The `ADT` **type** defines discriminated union types:
!*/

//>
export type Post =
	| ADT<"Ping">
	| ADT<"Text", { title?: string; body: string }>
	| ADT<"Photo" | "Video", { url: string }>;
void {} as unknown as Post; //-
//<

/*!
This is identical to defining the discriminated union manually:
!*/

//>
export type Post_ =
	| { $type: "Ping" }
	| { $type: "Text"; title?: string; body: string }
	| { $type: "Photo"; url: string }
	| { $type: "Video"; url: string };
void {} as unknown as Post_; //-
//<

//+ ## Values

/*!
The `ADT` **function** can define a values "builder" from a given ADT type:
!*/

//>
import { ADT } from "pb.adt";
//<

//>
export const Post = ADT<Post>();

const posts: Array<Post> = [
	Post.Ping(),
	Post.Text({ body: "Hello, World!" }),
	Post.Photo({ url: "https://example.com/image.jpg" }),
	Post.Video({ url: "https://example.com/video.mp4" }),
];
void posts; //-
//<

//>
const posts_: Array<Post> = [
	ADT<Post>().Ping(),
	ADT<Post>().Text({ body: "Hello, World!" }),
	ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
	ADT<Post>().Video({ url: "https://example.com/video.mp4" }),
];
void posts_; //-
//<

//+ ## Narrowing

/*!
Use the `$type` property can be used to discriminate in `if` and `switch`
statements:
!*/

//>
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
void handlePost; //-
//<

//+ ## Type Guard

/*!
The `ADT` **function** can also type-guard for an ADT value:
!*/

//>
type Other = object; //-
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
void handleValue; //-
//<

//+ ## Keys

/*!
Use `T['$type']` to get an ADT's discriminant types:
!*/

//>
type Types = Post["$type"];
void ({} as Types); //-
// "Ping" | "Text" | "Photo" | "Video"
//<

//+ ## Subtyping

/*!
Use `Extract` and `Exclude` to "pick" and "omit" matching ADT variants:
!*/

//>
type Text = Extract<Post, ADT<"Text">>;
void ({} as Text); //-
// { $type: "Text", ... }

type Media = Extract<Post, { url: string }>;
void ({} as Media); //-
// { $type: "Photo", ... } | { $type: "Video", ... }

type NotText = Exclude<Post, ADT<"Text">>;
void ({} as NotText); //-
// { $type: "Ping", ... } | { $type: "Photo", ... } | { $type: "Video", ... }

type NotUrls = Exclude<Post, { url: string }>;
void ({} as NotUrls); //-
// { $type: "Ping", ... } | { $type: "Text", ... }
//<
